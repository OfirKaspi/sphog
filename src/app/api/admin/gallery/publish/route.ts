import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import { publishGalleryImagesFromDraft } from "@/lib/api/galleryData"
import { revalidateGalleryPaths } from "@/lib/revalidateGallery"

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const result = await publishGalleryImagesFromDraft()
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Publish failed" }, { status: 500 })
  }

  const revalidated = revalidateGalleryPaths()

  return NextResponse.json({ success: true, revalidated })
}
