import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireAdminAuth } from "@/lib/adminAuth"
import {
  deleteCatalogProduct,
  getAdminCatalogProductById,
  updateCatalogProduct,
} from "@/lib/api/catalogData"
import { updateCatalogProductSchema } from "@/lib/api/catalogValidation"
import { buildCatalogImageAlt, buildCatalogSlug } from "@/lib/catalogMetadata"
import { deleteCatalogImage, extractCloudinaryPublicIdFromUrl } from "@/lib/cloudinary"
import type { Database } from "@/lib/supabase"

const paramsSchema = z.object({
  id: z.string().uuid(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const parsedParams = paramsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
  }

  const payload = await request.json()
  const name = typeof payload?.name === "string" ? payload.name : ""
  const normalizedPayload = {
    ...payload,
    ...(typeof payload?.name === "string"
      ? {
          slug:
            typeof payload?.slug === "string" && payload.slug.trim()
              ? payload.slug
              : buildCatalogSlug(name),
          image_alt:
            typeof payload?.image_alt === "string" && payload.image_alt.trim()
              ? payload.image_alt
              : buildCatalogImageAlt(name),
        }
      : {}),
  }
  const parsedBody = updateCatalogProductSchema.safeParse(normalizedPayload)
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsedBody.error.flatten() },
      { status: 422 }
    )
  }

  const existingProduct = await getAdminCatalogProductById(parsedParams.data.id)
  if (!existingProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const parsedPayload = parsedBody.data as Database["public"]["Tables"]["catalog_products"]["Update"]

  const { data, error } = await updateCatalogProduct(parsedParams.data.id, parsedPayload)
  if (error || !data) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }

  const oldPublicId = existingProduct.image_public_id || extractCloudinaryPublicIdFromUrl(existingProduct.image_url)
  const newPublicId = data.image_public_id || extractCloudinaryPublicIdFromUrl(data.image_url)
  if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
    try {
      await deleteCatalogImage(oldPublicId)
    } catch (imageDeleteError) {
      console.error("Failed to delete replaced product image:", imageDeleteError)
    }
  }

  try {
    revalidatePath("/")
    revalidatePath("/store")
  } catch (revalidateError) {
    console.log("Catalog revalidation warning:", revalidateError)
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

  const parsedParams = paramsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
  }

  const existingProduct = await getAdminCatalogProductById(parsedParams.data.id)
  if (!existingProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const { error } = await deleteCatalogProduct(parsedParams.data.id)
  if (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }

  const imagePublicId = existingProduct.image_public_id || extractCloudinaryPublicIdFromUrl(existingProduct.image_url)
  if (imagePublicId) {
    try {
      await deleteCatalogImage(imagePublicId)
    } catch (imageDeleteError) {
      console.error("Failed to delete product image:", imageDeleteError)
    }
  }

  try {
    revalidatePath("/")
    revalidatePath("/store")
  } catch (revalidateError) {
    console.log("Catalog revalidation warning:", revalidateError)
  }

  return NextResponse.json({ success: true })
}
