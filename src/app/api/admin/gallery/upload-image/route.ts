import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import {
  getAdminDraftGalleryImages,
  maybeDeleteCloudinaryGalleryImage,
} from "@/lib/api/galleryData"
import { deleteCloudinaryImage, uploadGalleryImage } from "@/lib/cloudinary"
import { GALLERY_DUPLICATE_MESSAGE } from "@/lib/constants/gallery"
import { draftHasDuplicateAsset } from "@/lib/galleryCompare"

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024

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
      return NextResponse.json({ error: "Image size must be 10MB or less" }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploaded = await uploadGalleryImage(buffer, image.name.replace(/\.[^/.]+$/, ""))

    const drafts = await getAdminDraftGalleryImages()
    if (
      draftHasDuplicateAsset(drafts, {
        src: uploaded.secure_url,
        image_public_id: uploaded.public_id,
      })
    ) {
      try {
        await deleteCloudinaryImage(uploaded.public_id)
      } catch (error) {
        console.error(
          "Failed to discard duplicate gallery upload from Cloudinary:",
          uploaded.public_id,
          error
        )
      }
      return NextResponse.json({ error: GALLERY_DUPLICATE_MESSAGE }, { status: 409 })
    }

    return NextResponse.json(
      {
        image_url: uploaded.secure_url,
        image_public_id: uploaded.public_id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Gallery image upload failed:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

/** Discard a Cloudinary asset that was uploaded but never attached to a draft row. */
export async function DELETE(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const payload = await request.json().catch(() => null)
  const publicId =
    typeof payload?.image_public_id === "string" ? payload.image_public_id.trim() : ""

  if (!publicId) {
    return NextResponse.json({ error: "image_public_id is required" }, { status: 400 })
  }

  await maybeDeleteCloudinaryGalleryImage(publicId)
  return NextResponse.json({ ok: true })
}
