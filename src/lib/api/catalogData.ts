import { Product } from "@/types/types"
import { Database, supabase } from "@/lib/supabase"

type CatalogProductRow = Database["public"]["Tables"]["catalog_products"]["Row"]
type CatalogProductInsert = Database["public"]["Tables"]["catalog_products"]["Insert"]
type CatalogProductUpdate = Database["public"]["Tables"]["catalog_products"]["Update"]

function mapCatalogRowToProduct(row: CatalogProductRow): Product {
  return {
    _id: row.id,
    name: row.name,
    price: Number(row.price),
    originalPrice: row.original_price === null ? undefined : Number(row.original_price),
    image: {
      src: row.image_url,
      alt: row.image_alt || row.name,
    },
    description: row.description,
    isInStock: row.in_stock,
  }
}

export async function getPublicCatalogProducts(filters?: {
  promoOnly?: boolean
  regularOnly?: boolean
  discountOnly?: boolean
  showOnHomeOnly?: boolean
  limit?: number
}): Promise<Product[]> {
  let query = supabase
    .from("catalog_products")
    .select("*")
    .eq("is_active", true)
    .eq("is_hidden", false)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (filters?.regularOnly) {
    query = query.eq("show_in_regular", true)
  }

  if (filters?.discountOnly || filters?.promoOnly) {
    query = query.eq("show_in_discount", true)
  }

  if (filters?.showOnHomeOnly) {
    query = query.eq("show_on_home", true)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query
  const isMissingNewColumnsError =
    (error as { code?: string } | null)?.code === "42703" &&
    (String((error as { message?: string } | null)?.message || "").includes("is_hidden") ||
      String((error as { message?: string } | null)?.message || "").includes("show_in_regular") ||
      String((error as { message?: string } | null)?.message || "").includes("show_in_discount"))

  if (isMissingNewColumnsError) {
    let legacyQuery = supabase
      .from("catalog_products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (filters?.discountOnly || filters?.promoOnly) {
      legacyQuery = legacyQuery.eq("is_promo", true)
    }
    if (filters?.showOnHomeOnly) {
      legacyQuery = legacyQuery.eq("show_on_home", true)
    }
    if (filters?.limit) {
      legacyQuery = legacyQuery.limit(filters.limit)
    }

    const { data: legacyData, error: legacyError } = await legacyQuery
    if (legacyError || !legacyData) {
      if (legacyError) {
        console.error("Error reading legacy catalog products:", legacyError)
      }
      return []
    }

    return legacyData.map(mapCatalogRowToProduct)
  }

  if (error || !data) {
    if (error) {
      console.error("Error reading catalog products:", error)
    }
    return []
  }

  return data.map(mapCatalogRowToProduct)
}

export async function getAdminCatalogProducts(): Promise<CatalogProductRow[]> {
  const { data, error } = await adminFetch<CatalogProductRow[]>(
    "/catalog_products?select=*&order=sort_order.asc,created_at.desc"
  )
  if (error || !data) return []
  return data
}

export async function getAdminCatalogProductById(id: string): Promise<CatalogProductRow | null> {
  const { data, error } = await adminFetchSingle<CatalogProductRow>(`/catalog_products?id=eq.${id}`)
  if (error || !data) return null
  return data
}

export async function countAdminHomePreviewProducts(excludeId?: string): Promise<number> {
  const { data, error } = await adminFetch<Array<{ id: string }>>("/catalog_products?select=id&show_on_home=eq.true")
  if (error || !data) return 0

  if (!excludeId) {
    return data.length
  }

  return data.filter((product) => product.id !== excludeId).length
}

export async function createCatalogProduct(payload: CatalogProductInsert) {
  return adminFetchSingle<CatalogProductRow>("/catalog_products", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateCatalogProduct(id: string, payload: CatalogProductUpdate) {
  return adminFetchSingle<CatalogProductRow>(`/catalog_products?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteCatalogProduct(id: string) {
  return adminFetch<null>(`/catalog_products?id=eq.${id}`, {
    method: "DELETE",
  })
}

export async function reorderCatalogProducts(items: Array<{ id: string; sort_order: number }>) {
  if (items.length === 0) {
    return { error: null as Error | null }
  }

  const results = await Promise.all(
    items.map((item) =>
      adminFetchSingle<CatalogProductRow>(`/catalog_products?id=eq.${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ sort_order: item.sort_order }),
      })
    )
  )

  const failed = results.find((result) => result.error)
  if (failed?.error) {
    return { error: failed.error }
  }

  return { error: null as Error | null }
}

async function adminFetch<T>(path: string, init: RequestInit = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return { data: null as T | null, error: new Error("Missing Supabase service role env vars") }
  }

  const response = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=representation",
      ...init.headers,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const text = await response.text()
    return { data: null as T | null, error: new Error(text || "Supabase request failed") }
  }

  const text = await response.text()
  if (!text) {
    return { data: null as T | null, error: null }
  }

  return { data: JSON.parse(text) as T, error: null }
}

async function adminFetchSingle<T>(path: string, init: RequestInit = {}) {
  const { data, error } = await adminFetch<T[]>(path, init)
  if (error || !data || data.length === 0) {
    return { data: null as T | null, error: error || new Error("No row returned") }
  }

  return { data: data[0], error: null }
}
