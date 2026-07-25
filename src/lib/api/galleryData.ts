import { unstable_noStore as noStore } from "next/cache"
import { cache } from "react"

import {
  deleteCloudinaryImage,
  extractCloudinaryPublicIdFromUrl,
  listGalleryResources,
  normalizeCloudinaryPublicId,
} from "@/lib/cloudinary"
import { dedupeWorkshopLogosByAsset } from "@/lib/logoAssetKey"
import { getSupabaseServiceRoleClient, supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

export { GALLERY_PAGE_TITLE } from "@/lib/constants/gallery"

type GalleryRow = Database["public"]["Tables"]["gallery_images"]["Row"]
type GalleryInsert = Database["public"]["Tables"]["gallery_images"]["Insert"]
type GalleryUpdate = Database["public"]["Tables"]["gallery_images"]["Update"]

export type GalleryImagePublic = { id: string; src: string; alt: string }

function defaultAltFromPublicId(publicId: string) {
  const tail = publicId.split("/").pop() ?? publicId
  const withoutExt = tail.replace(/\.[^.]+$/, "")
  return withoutExt.replace(/[_-]+/g, " ").trim() || "תמונה מהגלריה"
}

/** PostgREST: table/view not in schema cache (e.g. migration not applied). */
function isPostgrestRelationNotInSchema(error: unknown) {
  return (error as { code?: string })?.code === "PGRST205"
}

async function countStage(
  serviceClient: ReturnType<typeof getSupabaseServiceRoleClient>,
  stage: "draft" | "published"
): Promise<number> {
  const { count, error } = await serviceClient
    .from("gallery_images")
    .select("*", { count: "exact", head: true })
    .eq("stage", stage)

  if (error) {
    return 0
  }

  return count ?? 0
}

export async function copyDraftToPublished(
  serviceClient: ReturnType<typeof getSupabaseServiceRoleClient>
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await serviceClient.rpc("publish_gallery_images_from_draft")
  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/**
 * One-time seed: when there are no draft and no published rows, import all images
 * from Cloudinary folder `sphog/gallery` as draft only. Call from admin GET only.
 */
export async function ensureDraftGallerySeededFromCloudinary(): Promise<void> {
  try {
    const sr = getSupabaseServiceRoleClient()
    const publishedCount = await countStage(sr, "published")
    const draftCount = await countStage(sr, "draft")
    if (publishedCount > 0 || draftCount > 0) {
      return
    }

    let assets: Awaited<ReturnType<typeof listGalleryResources>>
    try {
      assets = await listGalleryResources()
    } catch (error) {
      console.error("Cloudinary list gallery failed (draft seed skipped):", error)
      return
    }

    if (assets.length === 0) {
      return
    }

    // Re-check after the (slow) Cloudinary list so a concurrent seed/admin
    // create that finished meanwhile is not overwritten with duplicates.
    const publishedAfterList = await countStage(sr, "published")
    const draftAfterList = await countStage(sr, "draft")
    if (publishedAfterList > 0 || draftAfterList > 0) {
      return
    }

    const inserts: GalleryInsert[] = assets.map((asset, index) => ({
      stage: "draft",
      image_url: asset.secure_url,
      image_public_id: asset.public_id,
      image_alt: defaultAltFromPublicId(asset.public_id),
      sort_order: index,
    }))

    const { error: insertErr } = await sr.from("gallery_images").insert(inserts)
    if (insertErr) {
      // Unique (stage, image_public_id) race: another request already seeded.
      if ((insertErr as { code?: string }).code === "23505") {
        return
      }
      if (!isPostgrestRelationNotInSchema(insertErr)) {
        console.error("Seed draft gallery images failed:", insertErr)
      }
    }
  } catch (error) {
    console.error("ensureDraftGallerySeededFromCloudinary:", error)
  }
}

export const getGalleryEnabled = cache(async (): Promise<boolean> => {
  noStore()

  const { data, error } = await supabase
    .from("gallery_settings")
    .select("gallery_enabled")
    .eq("id", "default")
    .maybeSingle()

  if (error) {
    if (!isPostgrestRelationNotInSchema(error)) {
      console.error("getGalleryEnabled:", error)
    }
    return true
  }

  if (!data) {
    return true
  }

  return Boolean(data.gallery_enabled)
})

/** Cheap existence check for nav/page gating (no row mapping / dedupe). */
export const hasPublishedGalleryImages = cache(async (): Promise<boolean> => {
  noStore()

  const { count, error } = await supabase
    .from("gallery_images")
    .select("id", { count: "exact", head: true })
    .eq("stage", "published")

  if (error) {
    if (!isPostgrestRelationNotInSchema(error)) {
      console.error("hasPublishedGalleryImages:", error)
    }
    return false
  }

  return (count ?? 0) > 0
})

export const getPublishedGalleryImages = cache(async (): Promise<GalleryImagePublic[]> => {
  noStore()

  const { data, error } = await supabase
    .from("gallery_images")
    .select("id, image_url, image_alt, sort_order, image_public_id, created_at")
    .eq("stage", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    if (!isPostgrestRelationNotInSchema(error)) {
      console.error("getPublishedGalleryImages:", error)
    }
    return []
  }

  const images = (data ?? []).map((row) => ({
    id: row.id,
    src: row.image_url,
    alt: row.image_alt?.trim() ? row.image_alt : "תמונה מהגלריה",
    image_public_id: row.image_public_id,
  }))

  return dedupeWorkshopLogosByAsset(images).map(({ id, src, alt }) => ({ id, src, alt }))
})

export const isGalleryNavVisible = cache(async (): Promise<boolean> => {
  const enabled = await getGalleryEnabled()
  if (!enabled) {
    return false
  }
  return hasPublishedGalleryImages()
})

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

export async function getAdminDraftGalleryImages(): Promise<GalleryRow[]> {
  const { data, error } = await adminFetch<GalleryRow[]>(
    "/gallery_images?select=*&stage=eq.draft&order=sort_order.asc,created_at.asc"
  )
  if (error || !data) {
    return []
  }
  return data
}

export async function getAdminPublishedGalleryImages(): Promise<GalleryRow[]> {
  const { data, error } = await adminFetch<GalleryRow[]>(
    "/gallery_images?select=*&stage=eq.published&order=sort_order.asc,created_at.asc"
  )
  if (error || !data) {
    return []
  }
  return data
}

export async function getAdminGalleryEnabledFromDb(): Promise<boolean> {
  const { data, error } = await adminFetch<Array<{ gallery_enabled: boolean }>>(
    "/gallery_settings?select=gallery_enabled&id=eq.default"
  )
  if (error || !data?.[0]) {
    return true
  }
  return Boolean(data[0].gallery_enabled)
}

export async function updateGalleryEnabled(enabled: boolean) {
  try {
    const sr = getSupabaseServiceRoleClient()
    const { data, error } = await sr
      .from("gallery_settings")
      .upsert({ id: "default", gallery_enabled: enabled }, { onConflict: "id" })
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }
    return { data, error: null as Error | null }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return { data: null, error: new Error(message) }
  }
}

export async function getAdminDraftGalleryImageById(id: string): Promise<GalleryRow | null> {
  const { data, error } = await adminFetchSingle<GalleryRow>(
    `/gallery_images?id=eq.${id}&stage=eq.draft`
  )
  if (error || !data) {
    return null
  }
  return data
}

export async function createDraftGalleryImage(payload: Omit<GalleryInsert, "stage">) {
  const draftPayload: GalleryInsert = { ...payload, stage: "draft" }
  return adminFetchSingle<GalleryRow>("/gallery_images", {
    method: "POST",
    body: JSON.stringify(draftPayload),
  })
}

export async function updateDraftGalleryImage(id: string, payload: GalleryUpdate) {
  return adminFetchSingle<GalleryRow>(`/gallery_images?id=eq.${id}&stage=eq.draft`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteDraftGalleryImageRow(id: string) {
  return adminFetch<null>(`/gallery_images?id=eq.${id}&stage=eq.draft`, {
    method: "DELETE",
  })
}

type GalleryAssetRefRow = Pick<GalleryRow, "image_url" | "image_public_id">

function addNormalizedCloudinaryRefsFromRow(row: GalleryAssetRefRow, into: Set<string>): void {
  if (row.image_public_id) {
    const n = normalizeCloudinaryPublicId(row.image_public_id)
    if (n) into.add(n)
  }
  const fromUrl = extractCloudinaryPublicIdFromUrl(row.image_url)
  if (fromUrl) {
    into.add(normalizeCloudinaryPublicId(fromUrl))
  }
}

function normalizedPublicIdsFromGalleryRows(rows: GalleryAssetRefRow[]): Set<string> {
  const set = new Set<string>()
  for (const row of rows) {
    addNormalizedCloudinaryRefsFromRow(row, set)
  }
  return set
}

function galleryRowReferencesCloudinaryPublicId(
  row: Pick<GalleryRow, "image_url" | "image_public_id">,
  normalizedPublicId: string
): boolean {
  if (!normalizedPublicId) {
    return false
  }
  if (row.image_public_id && normalizeCloudinaryPublicId(row.image_public_id) === normalizedPublicId) {
    return true
  }
  const fromUrl = extractCloudinaryPublicIdFromUrl(row.image_url)
  return Boolean(fromUrl && normalizeCloudinaryPublicId(fromUrl) === normalizedPublicId)
}

export async function countGalleryRowsReferencingCloudinaryPublicId(publicId: string): Promise<number> {
  const normalized = normalizeCloudinaryPublicId(publicId)
  if (!normalized) {
    return 0
  }

  const sr = getSupabaseServiceRoleClient()
  const { data, error } = await sr.from("gallery_images").select("image_url, image_public_id")

  if (error) {
    return 0
  }

  return (data ?? []).reduce(
    (acc, row) => acc + (galleryRowReferencesCloudinaryPublicId(row, normalized) ? 1 : 0),
    0
  )
}

export async function maybeDeleteCloudinaryGalleryImage(publicId: string | null | undefined) {
  if (!publicId) {
    return
  }

  const normalized = normalizeCloudinaryPublicId(publicId)
  if (!normalized) {
    return
  }

  const remaining = await countGalleryRowsReferencingCloudinaryPublicId(normalized)
  if (remaining > 0) {
    return
  }

  try {
    await deleteCloudinaryImage(normalized)
  } catch (error) {
    console.error("Failed to delete Cloudinary gallery image:", error)
  }
}

export async function reorderDraftGalleryImages(items: Array<{ id: string; sort_order: number }>) {
  if (items.length === 0) {
    return { error: null as Error | null }
  }

  const results = await Promise.all(
    items.map((item) =>
      adminFetchSingle<GalleryRow>(`/gallery_images?id=eq.${item.id}&stage=eq.draft`, {
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

export async function publishGalleryImagesFromDraft(): Promise<{ ok: boolean; error?: string }> {
  const sr = getSupabaseServiceRoleClient()

  const { data: prePublishPublished, error: snapshotErr } = await sr
    .from("gallery_images")
    .select("image_url, image_public_id")
    .eq("stage", "published")

  if (snapshotErr) {
    console.error("Pre-publish published snapshot (Cloudinary orphan cleanup):", snapshotErr)
  }

  const refsPreviouslyLive = normalizedPublicIdsFromGalleryRows(prePublishPublished ?? [])

  const result = await copyDraftToPublished(sr)
  if (!result.ok) {
    return result
  }

  const { data: allPostPublish, error: postErr } = await sr
    .from("gallery_images")
    .select("image_url, image_public_id")

  if (postErr) {
    console.error("Post-publish gallery refs (Cloudinary orphan cleanup):", postErr)
    return result
  }

  const stillReferenced = normalizedPublicIdsFromGalleryRows(allPostPublish ?? [])

  for (const publicId of refsPreviouslyLive) {
    if (!stillReferenced.has(publicId)) {
      try {
        console.info("Deleting orphaned Cloudinary gallery image after publish:", publicId)
        await deleteCloudinaryImage(publicId)
      } catch (error) {
        console.error("Post-publish Cloudinary delete failed for orphaned asset:", publicId, error)
      }
    }
  }

  return result
}
