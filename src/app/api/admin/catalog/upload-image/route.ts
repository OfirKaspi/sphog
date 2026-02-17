import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import { uploadCatalogImage } from "@/lib/cloudinary"

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
    const uploaded = await uploadCatalogImage(buffer, image.name.replace(/\.[^/.]+$/, ""))

    return NextResponse.json(
      {
        image_url: uploaded.secure_url,
        image_public_id: uploaded.public_id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Catalog image upload failed:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
