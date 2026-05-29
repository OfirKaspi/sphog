import { unstable_noStore as noStore } from "next/cache"

import {
  deleteCloudinaryImage,
  extractCloudinaryPublicIdFromUrl,
  listWorkshopLogoResources,
  normalizeCloudinaryPublicId,
} from "@/lib/cloudinary"
import { dedupeWorkshopLogosByAsset } from "@/lib/logoAssetKey"
import { getSupabaseServiceRoleClient, supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

export { PRIVATE_WORKSHOP_LOGOS_HEADING } from "@/lib/constants/privateWorkshopLogos"

type LogoRow = Database["public"]["Tables"]["private_workshop_logos"]["Row"]
type LogoInsert = Database["public"]["Tables"]["private_workshop_logos"]["Insert"]
type LogoUpdate = Database["public"]["Tables"]["private_workshop_logos"]["Update"]

export type WorkshopLogoPublic = { id: string; src: string; alt: string }

function defaultAltFromPublicId(publicId: string) {
  const tail = publicId.split("/").pop() ?? publicId
  const withoutExt = tail.replace(/\.[^.]+$/, "")
  return withoutExt.replace(/[_-]+/g, " ").trim() || "לוגו"
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
    .from("private_workshop_logos")
    .select("*", { count: "exact", head: true })
    .eq("stage", stage)

  if (error) {
    if (isPostgrestRelationNotInSchema(error)) {
      return 0
    }
    return 0
  }

  return count ?? 0
}

export async function copyDraftToPublished(
  serviceClient: ReturnType<typeof getSupabaseServiceRoleClient>
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await serviceClient.rpc("publish_private_workshop_logos_from_draft")
  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/**
 * One-time seed: when there are no draft and no published rows, import all images
 * from Cloudinary folder `sphog/logos` as draft only. Call from admin GET only.
 * Does not publish; admin must click Publish for the public site.
 */
export async function ensureDraftLogosSeededFromCloudinary(): Promise<void> {
  try {
    const sr = getSupabaseServiceRoleClient()
    const publishedCount = await countStage(sr, "published")
    const draftCount = await countStage(sr, "draft")
    if (publishedCount > 0 || draftCount > 0) {
      return
    }

    let assets: Awaited<ReturnType<typeof listWorkshopLogoResources>>
    try {
      assets = await listWorkshopLogoResources()
    } catch (error) {
      console.error("Cloudinary list logos failed (draft seed skipped):", error)
      return
    }

    if (assets.length === 0) {
      return
    }

    const inserts: LogoInsert[] = assets.map((asset, index) => ({
      stage: "draft",
      image_url: asset.secure_url,
      image_public_id: asset.public_id,
      image_alt: defaultAltFromPublicId(asset.public_id),
      sort_order: index,
    }))

    const { error: insertErr } = await sr.from("private_workshop_logos").insert(inserts)
    if (insertErr) {
      if (!isPostgrestRelationNotInSchema(insertErr)) {
        console.error("Seed draft workshop logos failed:", insertErr)
      }
    }
  } catch (error) {
    console.error("ensureDraftLogosSeededFromCloudinary:", error)
  }
}

export async function getPrivateWorkshopCarouselEnabled(): Promise<boolean> {
  noStore()

  const { data, error } = await supabase
    .from("private_workshop_settings")
    .select("carousel_enabled")
    .eq("id", "default")
    .maybeSingle()

  if (error) {
    if (!isPostgrestRelationNotInSchema(error)) {
      console.error("getPrivateWorkshopCarouselEnabled:", error)
    }
    return true
  }

  if (!data) {
    return true
  }

  return Boolean(data.carousel_enabled)
}

export async function getPublishedPrivateWorkshopLogos(): Promise<WorkshopLogoPublic[]> {
  noStore()

  const { data, error } = await supabase
    .from("private_workshop_logos")
    .select("id, image_url, image_alt, sort_order, image_public_id, created_at")
    .eq("stage", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    if (!isPostgrestRelationNotInSchema(error)) {
      console.error("getPublishedPrivateWorkshopLogos:", error)
    }
    return []
  }

  const logos = (data ?? []).map((row) => ({
    id: row.id,
    src: row.image_url,
    alt: row.image_alt?.trim() ? row.image_alt : "לוגו",
    image_public_id: row.image_public_id,
  }))

  return dedupeWorkshopLogosByAsset(logos).map(({ id, src, alt }) => ({ id, src, alt }))
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

export async function getAdminDraftPrivateWorkshopLogos(): Promise<LogoRow[]> {
  const { data, error } = await adminFetch<LogoRow[]>(
    "/private_workshop_logos?select=*&stage=eq.draft&order=sort_order.asc,created_at.asc"
  )
  if (error || !data) {
    return []
  }
  return data
}

export async function getAdminPublishedPrivateWorkshopLogos(): Promise<LogoRow[]> {
  const { data, error } = await adminFetch<LogoRow[]>(
    "/private_workshop_logos?select=*&stage=eq.published&order=sort_order.asc,created_at.asc"
  )
  if (error || !data) {
    return []
  }
  return data
}

export async function getAdminCarouselEnabledFromDb(): Promise<boolean> {
  const { data, error } = await adminFetch<Array<{ carousel_enabled: boolean }>>(
    "/private_workshop_settings?select=carousel_enabled&id=eq.default"
  )
  if (error || !data?.[0]) {
    return true
  }
  return Boolean(data[0].carousel_enabled)
}

export async function updatePrivateWorkshopCarouselEnabled(enabled: boolean) {
  try {
    const sr = getSupabaseServiceRoleClient()
    const { data, error } = await sr
      .from("private_workshop_settings")
      .upsert(
        { id: "default", carousel_enabled: enabled },
        { onConflict: "id" }
      )
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

export async function getAdminDraftLogoById(id: string): Promise<LogoRow | null> {
  const { data, error } = await adminFetchSingle<LogoRow>(`/private_workshop_logos?id=eq.${id}&stage=eq.draft`)
  if (error || !data) {
    return null
  }
  return data
}

export async function createDraftPrivateWorkshopLogo(payload: Omit<LogoInsert, "stage">) {
  const draftPayload: LogoInsert = { ...payload, stage: "draft" }
  return adminFetchSingle<LogoRow>("/private_workshop_logos", {
    method: "POST",
    body: JSON.stringify(draftPayload),
  })
}

export async function updateDraftPrivateWorkshopLogo(id: string, payload: LogoUpdate) {
  return adminFetchSingle<LogoRow>(`/private_workshop_logos?id=eq.${id}&stage=eq.draft`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteDraftPrivateWorkshopLogoRow(id: string) {
  return adminFetch<null>(`/private_workshop_logos?id=eq.${id}&stage=eq.draft`, {
    method: "DELETE",
  })
}

type LogoAssetRefRow = Pick<LogoRow, "image_url" | "image_public_id">

function addNormalizedCloudinaryRefsFromRow(row: LogoAssetRefRow, into: Set<string>): void {
  if (row.image_public_id) {
    const n = normalizeCloudinaryPublicId(row.image_public_id)
    if (n) into.add(n)
  }
  const fromUrl = extractCloudinaryPublicIdFromUrl(row.image_url)
  if (fromUrl) {
    into.add(normalizeCloudinaryPublicId(fromUrl))
  }
}

function normalizedPublicIdsFromLogoRows(rows: LogoAssetRefRow[]): Set<string> {
  const set = new Set<string>()
  for (const row of rows) {
    addNormalizedCloudinaryRefsFromRow(row, set)
  }
  return set
}

function logoRowReferencesCloudinaryPublicId(
  row: Pick<LogoRow, "image_url" | "image_public_id">,
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

/** Count draft + published rows that still use this Cloudinary asset (by public_id column or URL). */
export async function countLogoRowsReferencingCloudinaryPublicId(publicId: string): Promise<number> {
  const normalized = normalizeCloudinaryPublicId(publicId)
  if (!normalized) {
    return 0
  }

  const sr = getSupabaseServiceRoleClient()
  const { data, error } = await sr.from("private_workshop_logos").select("image_url, image_public_id")

  if (error) {
    return 0
  }

  return (data ?? []).reduce(
    (acc, row) => acc + (logoRowReferencesCloudinaryPublicId(row, normalized) ? 1 : 0),
    0
  )
}

export async function maybeDeleteCloudinaryLogo(publicId: string | null | undefined) {
  if (!publicId) {
    return
  }

  const normalized = normalizeCloudinaryPublicId(publicId)
  if (!normalized) {
    return
  }

  const remaining = await countLogoRowsReferencingCloudinaryPublicId(normalized)
  if (remaining > 0) {
    return
  }

  try {
    await deleteCloudinaryImage(normalized)
  } catch (error) {
    console.error("Failed to delete Cloudinary logo:", error)
  }
}

export async function reorderDraftPrivateWorkshopLogos(items: Array<{ id: string; sort_order: number }>) {
  if (items.length === 0) {
    return { error: null as Error | null }
  }

  const results = await Promise.all(
    items.map((item) =>
      adminFetchSingle<LogoRow>(`/private_workshop_logos?id=eq.${item.id}&stage=eq.draft`, {
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

export async function publishPrivateWorkshopLogosFromDraft(): Promise<{ ok: boolean; error?: string }> {
  const sr = getSupabaseServiceRoleClient()

  const { data: prePublishPublished, error: snapshotErr } = await sr
    .from("private_workshop_logos")
    .select("image_url, image_public_id")
    .eq("stage", "published")

  if (snapshotErr) {
    console.error("Pre-publish published snapshot (Cloudinary orphan cleanup):", snapshotErr)
  }

  const refsPreviouslyLive = normalizedPublicIdsFromLogoRows(prePublishPublished ?? [])

  const result = await copyDraftToPublished(sr)
  if (!result.ok) {
    return result
  }

  const { data: allPostPublish, error: postErr } = await sr
    .from("private_workshop_logos")
    .select("image_url, image_public_id")

  if (postErr) {
    console.error("Post-publish logo refs (Cloudinary orphan cleanup):", postErr)
    return result
  }

  const stillReferenced = normalizedPublicIdsFromLogoRows(allPostPublish ?? [])

  for (const publicId of refsPreviouslyLive) {
    if (!stillReferenced.has(publicId)) {
      try {
        console.info("Deleting orphaned Cloudinary logo after publish:", publicId)
        await deleteCloudinaryImage(publicId)
      } catch (error) {
        console.error("Post-publish Cloudinary delete failed for orphaned asset:", publicId, error)
      }
    }
  }

  return result
}
