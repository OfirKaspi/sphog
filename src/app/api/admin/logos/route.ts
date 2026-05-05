import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import {
  createDraftPrivateWorkshopLogo,
  ensureDraftLogosSeededFromCloudinary,
  getAdminCarouselEnabledFromDb,
  getAdminDraftPrivateWorkshopLogos,
  getAdminPublishedPrivateWorkshopLogos,
  reorderDraftPrivateWorkshopLogos,
} from "@/lib/api/privateWorkshopLogosData"
import { createPrivateWorkshopLogoSchema } from "@/lib/api/privateWorkshopLogosValidation"
import { draftAndPublishedLogoRowsEqual } from "@/lib/privateWorkshopLogosCompare"
import type { Database } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  await ensureDraftLogosSeededFromCloudinary()
  const draft = await getAdminDraftPrivateWorkshopLogos()
  const published = await getAdminPublishedPrivateWorkshopLogos()
  const carouselEnabled = await getAdminCarouselEnabledFromDb()
  const hasUnpublishedChanges = !draftAndPublishedLogoRowsEqual(draft, published)

  return NextResponse.json({
    draft,
    published,
    carouselEnabled,
    hasUnpublishedChanges,
  })
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const payload = await request.json().catch(() => null)
  const parsed = createPrivateWorkshopLogoSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const drafts = await getAdminDraftPrivateWorkshopLogos()
  const nextSort = 0

  const insertPayload: Database["public"]["Tables"]["private_workshop_logos"]["Insert"] = {
    stage: "draft",
    image_url: parsed.data.image_url,
    image_public_id: parsed.data.image_public_id ?? null,
    image_alt: parsed.data.image_alt ?? "",
    sort_order: nextSort,
  }

  const { data, error } = await createDraftPrivateWorkshopLogo(insertPayload)
  if (error || !data) {
    return NextResponse.json({ error: "Failed to create logo" }, { status: 500 })
  }

  // Keep "newest first" persistent across reloads by shifting previous draft sort_order values.
  const reorderItems = [data, ...drafts].map((row, index) => ({ id: row.id, sort_order: index }))
  const reorderResult = await reorderDraftPrivateWorkshopLogos(reorderItems)
  if (reorderResult.error) {
    return NextResponse.json({ error: "Failed to reorder logos" }, { status: 500 })
  }

  const normalized = { ...data, sort_order: 0 }

  return NextResponse.json(normalized, { status: 201 })
}
