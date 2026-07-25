import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import {
  deleteDraftGalleryImageRow,
  getAdminDraftGalleryImageById,
  maybeDeleteCloudinaryGalleryImage,
  updateDraftGalleryImage,
} from "@/lib/api/galleryData"
import { galleryImageIdParamsSchema, updateGalleryImageSchema } from "@/lib/api/galleryValidation"
import { extractCloudinaryPublicIdFromUrl } from "@/lib/cloudinary"
import type { Database } from "@/lib/supabase"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const parsedParams = galleryImageIdParamsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid gallery image id" }, { status: 400 })
  }

  const existing = await getAdminDraftGalleryImageById(parsedParams.data.id)
  if (!existing) {
    return NextResponse.json({ error: "Gallery image not found" }, { status: 404 })
  }

  const payload = await request.json().catch(() => null)
  const parsedBody = updateGalleryImageSchema.safeParse(payload)
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsedBody.error.flatten() },
      { status: 422 }
    )
  }

  const updatePayload = parsedBody.data as Database["public"]["Tables"]["gallery_images"]["Update"]
  const { data, error } = await updateDraftGalleryImage(parsedParams.data.id, updatePayload)
  if (error || !data) {
    return NextResponse.json({ error: "Failed to update gallery image" }, { status: 500 })
  }

  const oldPublicId = existing.image_public_id || extractCloudinaryPublicIdFromUrl(existing.image_url)
  const newPublicId = data.image_public_id || extractCloudinaryPublicIdFromUrl(data.image_url)
  if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
    await maybeDeleteCloudinaryGalleryImage(oldPublicId)
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const parsedParams = galleryImageIdParamsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid gallery image id" }, { status: 400 })
  }

  const existing = await getAdminDraftGalleryImageById(parsedParams.data.id)
  if (!existing) {
    return NextResponse.json({ error: "Gallery image not found" }, { status: 404 })
  }

  const publicId = existing.image_public_id || extractCloudinaryPublicIdFromUrl(existing.image_url)

  const { error } = await deleteDraftGalleryImageRow(parsedParams.data.id)
  if (error) {
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 })
  }

  await maybeDeleteCloudinaryGalleryImage(publicId ?? undefined)

  return NextResponse.json({ success: true })
}
