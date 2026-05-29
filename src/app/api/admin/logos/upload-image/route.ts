import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import { getAdminDraftPrivateWorkshopLogos } from "@/lib/api/privateWorkshopLogosData"
import { deleteCloudinaryImage, uploadLogoImage } from "@/lib/cloudinary"
import { LOGO_DUPLICATE_MESSAGE } from "@/lib/constants/privateWorkshopLogos"
import { draftHasDuplicateAsset } from "@/lib/logoAssetKey"

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const formData = await request.formData()
    const image = formData.get("image")

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 })
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    if (image.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json({ error: "Image size must be 5MB or less" }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploaded = await uploadLogoImage(buffer, image.name.replace(/\.[^/.]+$/, ""))

    const drafts = await getAdminDraftPrivateWorkshopLogos()
    if (
      draftHasDuplicateAsset(drafts, {
        src: uploaded.secure_url,
        image_public_id: uploaded.public_id,
      })
    ) {
      try {
        await deleteCloudinaryImage(uploaded.public_id)
      } catch (error) {
        console.error("Failed to discard duplicate logo upload from Cloudinary:", uploaded.public_id, error)
      }
      return NextResponse.json({ error: LOGO_DUPLICATE_MESSAGE }, { status: 409 })
    }

    return NextResponse.json(
      {
        image_url: uploaded.secure_url,
        image_public_id: uploaded.public_id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Logo image upload failed:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
