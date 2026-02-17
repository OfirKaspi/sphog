import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { requireAdminAuth } from "@/lib/adminAuth"
import { createCatalogProduct, getAdminCatalogProducts } from "@/lib/api/catalogData"
import { buildCatalogImageAlt, buildCatalogSlug } from "@/lib/catalogMetadata"
import { extractCloudinaryPublicIdFromUrl } from "@/lib/cloudinary"
import type { Database } from "@/lib/supabase"

const demoProducts: Array<
  Pick<
    Database["public"]["Tables"]["catalog_products"]["Insert"],
    | "name"
    | "description"
    | "price"
    | "original_price"
    | "image_url"
    | "in_stock"
    | "show_on_home"
    | "show_in_regular"
    | "show_in_discount"
    | "sort_order"
  >
> = [
  {
    name: "טרריום זכוכית קלאסי",
    description: "טרריום מאוזן, עשיר בטחב וצמחים ירוקים, מתאים לסלון או למשרד.",
    price: 690,
    original_price: null,
    image_url: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749929963/sphog/2-min_1_u7ojgq.jpg",
    in_stock: true,
    show_on_home: true,
    show_in_regular: true,
    show_in_discount: false,
    sort_order: 1,
  },
  {
    name: "טרריום גובה בינוני",
    description: "טרריום אלגנטי עם קומפוזיציה עשירה ליצירת פינה ירוקה ומרגיעה בבית.",
    price: 840,
    original_price: null,
    image_url: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824379/sphog/6_c1w4lp.jpg",
    in_stock: true,
    show_on_home: true,
    show_in_regular: true,
    show_in_discount: false,
    sort_order: 2,
  },
  {
    name: "טרריום מבצע שבועי",
    description: "דגם מבצע במחיר מיוחד לזמן מוגבל, עם עיצוב טבעי מלא עומק.",
    price: 790,
    original_price: 950,
    image_url: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824379/sphog/7_d1gf6g.jpg",
    in_stock: true,
    show_on_home: true,
    show_in_regular: false,
    show_in_discount: true,
    sort_order: 3,
  },
  {
    name: "טרריום פרימיום",
    description: "דגם פרימיום גדול עם חומרים איכותיים, לאוהבי עיצוב מוקפד במיוחד.",
    price: 1190,
    original_price: null,
    image_url: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749893918/sphog/%D7%98%D7%99%D7%A4_%D7%90%D7%99%D7%9A_%D7%9C%D7%A9%D7%9E%D7%95%D7%A8_%D7%A2%D7%9C_%D7%94%D7%98%D7%A8%D7%A8%D7%99%D7%95%D7%9D_-_%D7%98%D7%A8%D7%A8%D7%99%D7%95%D7%9D_%D7%90%D7%A7%D7%93%D7%9E%D7%99_dp1rzt.webp",
    in_stock: true,
    show_on_home: false,
    show_in_regular: true,
    show_in_discount: false,
    sort_order: 4,
  },
]

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const existing = await getAdminCatalogProducts()
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "כבר קיימים מוצרים. לא נטענו נתוני דמו כדי לא לדרוס מידע." },
      { status: 409 }
    )
  }

  const createdIds: string[] = []
  for (const product of demoProducts) {
    const payload: Database["public"]["Tables"]["catalog_products"]["Insert"] = {
      slug: buildCatalogSlug(product.name),
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.original_price,
      currency: "ILS",
      image_url: product.image_url,
      image_public_id: extractCloudinaryPublicIdFromUrl(product.image_url),
      image_alt: buildCatalogImageAlt(product.name),
      in_stock: product.in_stock,
      is_promo: product.show_in_discount,
      show_on_home: product.show_on_home,
      show_in_regular: product.show_in_regular,
      show_in_discount: product.show_in_discount,
      is_hidden: false,
      is_active: true,
      sort_order: product.sort_order,
    }

    const { data, error } = await createCatalogProduct(payload)
    if (error || !data) {
      return NextResponse.json({ error: "טעינת נתוני דמו נכשלה" }, { status: 500 })
    }

    createdIds.push(data.id)
  }

  try {
    revalidatePath("/")
    revalidatePath("/store")
  } catch (revalidateError) {
    console.log("Catalog revalidation warning:", revalidateError)
  }

  return NextResponse.json({ success: true, created: createdIds.length })
}
