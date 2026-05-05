import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import {
  deleteDraftPrivateWorkshopLogoRow,
  getAdminDraftLogoById,
  maybeDeleteCloudinaryLogo,
  updateDraftPrivateWorkshopLogo,
} from "@/lib/api/privateWorkshopLogosData"
import { privateWorkshopLogoIdParamsSchema, updatePrivateWorkshopLogoSchema } from "@/lib/api/privateWorkshopLogosValidation"
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

  const parsedParams = privateWorkshopLogoIdParamsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid logo id" }, { status: 400 })
  }

  const existing = await getAdminDraftLogoById(parsedParams.data.id)
  if (!existing) {
    return NextResponse.json({ error: "Logo not found" }, { status: 404 })
  }

  const payload = await request.json().catch(() => null)
  const parsedBody = updatePrivateWorkshopLogoSchema.safeParse(payload)
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsedBody.error.flatten() },
      { status: 422 }
    )
  }

  const updatePayload = parsedBody.data as Database["public"]["Tables"]["private_workshop_logos"]["Update"]
  const { data, error } = await updateDraftPrivateWorkshopLogo(parsedParams.data.id, updatePayload)
  if (error || !data) {
    return NextResponse.json({ error: "Failed to update logo" }, { status: 500 })
  }

  const oldPublicId = existing.image_public_id || extractCloudinaryPublicIdFromUrl(existing.image_url)
  const newPublicId = data.image_public_id || extractCloudinaryPublicIdFromUrl(data.image_url)
  if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
    await maybeDeleteCloudinaryLogo(oldPublicId)
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

  const parsedParams = privateWorkshopLogoIdParamsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid logo id" }, { status: 400 })
  }

  const existing = await getAdminDraftLogoById(parsedParams.data.id)
  if (!existing) {
    return NextResponse.json({ error: "Logo not found" }, { status: 404 })
  }

  const publicId = existing.image_public_id || extractCloudinaryPublicIdFromUrl(existing.image_url)

  const { error } = await deleteDraftPrivateWorkshopLogoRow(parsedParams.data.id)
  if (error) {
    return NextResponse.json({ error: "Failed to delete logo" }, { status: 500 })
  }

  await maybeDeleteCloudinaryLogo(publicId ?? undefined)

  return NextResponse.json({ success: true })
}
