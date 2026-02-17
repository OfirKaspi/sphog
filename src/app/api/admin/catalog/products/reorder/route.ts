import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireAdminAuth } from "@/lib/adminAuth"
import { reorderCatalogProducts } from "@/lib/api/catalogData"

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      sort_order: z.number().int().nonnegative(),
    })
  ),
})

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const payload = await request.json().catch(() => null)
  const parsed = reorderSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { error } = await reorderCatalogProducts(parsed.data.items)
  if (error) {
    return NextResponse.json({ error: "Failed to reorder products" }, { status: 500 })
  }

  try {
    revalidatePath("/")
    revalidatePath("/store")
  } catch (revalidateError) {
    console.log("Catalog revalidation warning:", revalidateError)
  }

  return NextResponse.json({ success: true })
}
