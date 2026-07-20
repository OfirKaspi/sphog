import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import { updateGalleryEnabled } from "@/lib/api/galleryData"
import { updateGallerySettingsSchema } from "@/lib/api/galleryValidation"
import { revalidateGalleryPaths } from "@/lib/revalidateGallery"

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const payload = await request.json().catch(() => null)
  const parsed = updateGallerySettingsSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { data, error } = await updateGalleryEnabled(parsed.data.gallery_enabled)
  if (error || !data) {
    console.error("updateGalleryEnabled:", error?.message ?? "no row")
    return NextResponse.json(
      {
        error: "Failed to update settings",
        ...(process.env.NODE_ENV === "development" ? { detail: error?.message } : {}),
      },
      { status: 500 }
    )
  }

  revalidateGalleryPaths()

  return NextResponse.json(data)
}
