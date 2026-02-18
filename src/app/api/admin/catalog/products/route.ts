import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { requireAdminAuth } from "@/lib/adminAuth"
import { createCatalogProduct, getAdminCatalogProducts } from "@/lib/api/catalogData"
import { createCatalogProductSchema } from "@/lib/api/catalogValidation"
import { buildCatalogImageAlt, buildCatalogSlug } from "@/lib/catalogMetadata"
import type { Database } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const products = await getAdminCatalogProducts()
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const payload = await request.json()
  const name = typeof payload?.name === "string" ? payload.name : ""
  const normalizedPayload = {
    ...payload,
    slug: typeof payload?.slug === "string" && payload.slug.trim() ? payload.slug : buildCatalogSlug(name),
    image_alt:
      typeof payload?.image_alt === "string" && payload.image_alt.trim()
        ? payload.image_alt
        : buildCatalogImageAlt(name),
  }
  const parsed = createCatalogProductSchema.safeParse(normalizedPayload)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const parsedPayload = parsed.data as Database["public"]["Tables"]["catalog_products"]["Insert"]

  const { data, error } = await createCatalogProduct(parsedPayload)
  if (error || !data) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }

  try {
    revalidatePath("/")
    revalidatePath("/store")
  } catch (revalidateError) {
    console.log("Catalog revalidation warning:", revalidateError)
  }

  return NextResponse.json(data, { status: 201 })
}
