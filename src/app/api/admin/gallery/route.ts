import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import {
  createDraftGalleryImage,
  ensureDraftGallerySeededFromCloudinary,
  getAdminDraftGalleryImages,
  getAdminGalleryEnabledFromDb,
  getAdminPublishedGalleryImages,
  maybeDeleteCloudinaryGalleryImage,
  reorderDraftGalleryImages,
} from "@/lib/api/galleryData"
import { createGalleryImageSchema } from "@/lib/api/galleryValidation"
import { GALLERY_DUPLICATE_MESSAGE } from "@/lib/constants/gallery"
import { draftAndPublishedGalleryRowsEqual, draftHasDuplicateAsset } from "@/lib/galleryCompare"
import type { Database } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  await ensureDraftGallerySeededFromCloudinary()
  const draft = await getAdminDraftGalleryImages()
  const published = await getAdminPublishedGalleryImages()
  const galleryEnabled = await getAdminGalleryEnabledFromDb()
  const hasUnpublishedChanges = !draftAndPublishedGalleryRowsEqual(draft, published)

  return NextResponse.json({
    draft,
    published,
    galleryEnabled,
    hasUnpublishedChanges,
  })
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const payload = await request.json().catch(() => null)
  const parsed = createGalleryImageSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const drafts = await getAdminDraftGalleryImages()

  if (
    draftHasDuplicateAsset(drafts, {
      src: parsed.data.image_url,
      image_public_id: parsed.data.image_public_id ?? null,
    })
  ) {
    await maybeDeleteCloudinaryGalleryImage(parsed.data.image_public_id)
    return NextResponse.json({ error: GALLERY_DUPLICATE_MESSAGE }, { status: 409 })
  }

  const nextSort = drafts.length

  const insertPayload: Database["public"]["Tables"]["gallery_images"]["Insert"] = {
    stage: "draft",
    image_url: parsed.data.image_url,
    image_public_id: parsed.data.image_public_id ?? null,
    image_alt: parsed.data.image_alt ?? "",
    sort_order: nextSort,
  }

  const { data, error } = await createDraftGalleryImage(insertPayload)
  if (error || !data) {
    await maybeDeleteCloudinaryGalleryImage(parsed.data.image_public_id)
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 })
  }

  // Image is already persisted; treat reorder as best-effort so a sort glitch
  // does not surface as a failed upload while leaving an orphaned draft row.
  const reorderItems = [...drafts, data].map((row, index) => ({ id: row.id, sort_order: index }))
  const reorderResult = await reorderDraftGalleryImages(reorderItems)
  if (reorderResult.error) {
    console.error("Gallery create succeeded but reorder failed:", reorderResult.error)
  }

  const normalized = { ...data, sort_order: nextSort }

  return NextResponse.json(normalized, { status: 201 })
}
