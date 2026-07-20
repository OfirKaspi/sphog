import { unstable_noStore as noStore } from "next/cache"
import { cache } from "react"

import { CONFIG } from "@/config/config"
import { getSupabaseServiceRoleClient, supabase } from "@/lib/supabase"

const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const FALLBACK_RATING = 5
const FALLBACK_REVIEW_COUNT = 50

export type GoogleReviewsBadgeData = {
  rating: number
  reviewCount: number
  mapsUrl: string
  source: "places" | "fallback"
}

type CacheRow = {
  rating: number | string
  review_count: number
  maps_url: string
  source: "places" | "fallback"
  fetched_at: string
}

type CacheReadResult =
  | { ok: true; row: CacheRow | null }
  | { ok: false; error: string }

type CacheWriteResult = { ok: true } | { ok: false; error: string }

/** Always returns a clickable Google Maps URL (env → config short link → Place ID → coords). */
export function resolveGoogleReviewsUrl(preferred?: string | null) {
  const fromPreferred = preferred?.trim()
  if (fromPreferred) return fromPreferred

  const fromEnv = (process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL || "").trim()
  if (fromEnv) return fromEnv

  if (CONFIG.googleReviewsUrl?.trim()) {
    return CONFIG.googleReviewsUrl.trim()
  }

  const placeId = process.env.GOOGLE_PLACE_ID?.trim()
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`
  }

  const { lat, lng, contactAddress } = CONFIG
  if (typeof lat === "number" && typeof lng === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`
  }

  const query = `Sphog ${contactAddress || "תל אביב"}`.trim()
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function fallbackReviews(): GoogleReviewsBadgeData {
  return {
    rating: FALLBACK_RATING,
    reviewCount: FALLBACK_REVIEW_COUNT,
    mapsUrl: resolveGoogleReviewsUrl(),
    source: "fallback",
  }
}

function isFresh(fetchedAt: string | null | undefined) {
  if (!fetchedAt) return false
  const ts = Date.parse(fetchedAt)
  if (Number.isNaN(ts)) return false
  return Date.now() - ts < CACHE_TTL_MS
}

function rowToBadge(row: Omit<CacheRow, "fetched_at">): GoogleReviewsBadgeData {
  const rating = typeof row.rating === "string" ? Number(row.rating) : row.rating
  return {
    rating: Number.isFinite(rating) ? rating : FALLBACK_RATING,
    reviewCount: row.review_count,
    mapsUrl: resolveGoogleReviewsUrl(row.maps_url),
    source: row.source,
  }
}

async function readCacheRow(): Promise<CacheReadResult> {
  const { data, error } = await supabase
    .from("google_reviews_cache")
    .select("rating, review_count, maps_url, source, fetched_at")
    .eq("id", "default")
    .maybeSingle()

  if (error) {
    const message = error.message || "google_reviews_cache read failed"
    if ((error as { code?: string }).code === "PGRST205") {
      // Table not in schema — treat as empty for display, but callers that write must not assume wipe-safe.
      return { ok: true, row: null }
    }
    console.error("google_reviews_cache read:", error)
    return { ok: false, error: message }
  }

  return { ok: true, row: (data as CacheRow | null) ?? null }
}

async function upsertCache(payload: {
  rating: number
  review_count: number
  maps_url: string
  source: "places" | "fallback"
  fetched_at: string
}): Promise<CacheWriteResult> {
  try {
    const sr = getSupabaseServiceRoleClient()
    const { error } = await sr.from("google_reviews_cache").upsert(
      {
        id: "default",
        ...payload,
      },
      { onConflict: "id" }
    )
    if (error) {
      console.error("google_reviews_cache upsert:", error)
      return { ok: false, error: error.message || "upsert failed" }
    }
    return { ok: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("google_reviews_cache upsert failed:", message)
    return { ok: false, error: message }
  }
}

type PlacesDetailsResponse = {
  status?: string
  result?: {
    rating?: number
    user_ratings_total?: number
    url?: string
  }
  error_message?: string
}

async function fetchFromPlacesApi(): Promise<GoogleReviewsBadgeData | null> {
  // Prefer dedicated Places key; fall back to existing Maps key if Places is enabled on it.
  const apiKey =
    process.env.GOOGLE_PLACES_API_KEY?.trim() ||
    process.env.GOOGLE_MAPS_API_KEY?.trim()
  const placeId = process.env.GOOGLE_PLACE_ID?.trim()
  if (!apiKey || !placeId) {
    return null
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "rating,user_ratings_total,url",
    key: apiKey,
    language: "he",
  })

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    console.error("Places API HTTP error:", response.status)
    return null
  }

  const body = (await response.json()) as PlacesDetailsResponse
  if (body.status !== "OK" || !body.result) {
    console.error("Places API status:", body.status, body.error_message)
    return null
  }

  const rating = body.result.rating
  const reviewCount = body.result.user_ratings_total
  if (typeof rating !== "number" || typeof reviewCount !== "number") {
    return null
  }

  const mapsUrl = resolveGoogleReviewsUrl(
    typeof body.result.url === "string" ? body.result.url : null
  )

  return {
    rating,
    reviewCount,
    mapsUrl,
    source: "places",
  }
}

export type RefreshGoogleReviewsResult = {
  data: GoogleReviewsBadgeData
  /** False when Places/cache write failed or cache could not be read safely. */
  ok: boolean
  error?: string
}

/**
 * Force refresh from Places (used by cron).
 * Never overwrites an existing cache with fallback when the cache read fails.
 * Surfaces persist failures so cron does not report false success.
 */
export async function refreshGoogleReviewsCache(): Promise<RefreshGoogleReviewsResult> {
  noStore()

  try {
    const fresh = await fetchFromPlacesApi()
    if (fresh) {
      const write = await upsertCache({
        rating: fresh.rating,
        review_count: fresh.reviewCount,
        maps_url: fresh.mapsUrl,
        source: "places",
        fetched_at: new Date().toISOString(),
      })
      if (!write.ok) {
        return {
          data: fresh,
          ok: false,
          error: `Places fetch succeeded but cache write failed: ${write.error}`,
        }
      }
      return { data: fresh, ok: true }
    }
  } catch (error) {
    console.error("refreshGoogleReviewsCache Places fetch:", error)
  }

  const cached = await readCacheRow()
  if (!cached.ok) {
    // Do not upsert fallback — we may be about to wipe a valid places row we failed to read.
    return {
      data: fallbackReviews(),
      ok: false,
      error: `Places unavailable and cache read failed: ${cached.error}`,
    }
  }

  if (cached.row) {
    return { data: rowToBadge(cached.row), ok: true }
  }

  // Confirmed empty cache — seed fallback once.
  const fallback = fallbackReviews()
  const write = await upsertCache({
    rating: fallback.rating,
    review_count: fallback.reviewCount,
    maps_url: fallback.mapsUrl,
    source: "fallback",
    fetched_at: new Date().toISOString(),
  })
  if (!write.ok) {
    return {
      data: fallback,
      ok: false,
      error: `Empty cache seed write failed: ${write.error}`,
    }
  }
  return { data: fallback, ok: true }
}

/**
 * Public badge data: fresh cache when possible; Places refresh when stale;
 * last cache or static 50+ / 5★ fallback otherwise (Places kept for later).
 */
export const getGoogleReviews = cache(async (): Promise<GoogleReviewsBadgeData> => {
  noStore()

  const cached = await readCacheRow()
  const cachedRow = cached.ok ? cached.row : null

  if (cachedRow && isFresh(cachedRow.fetched_at) && cachedRow.source === "places") {
    return rowToBadge(cachedRow)
  }

  // Stale / empty / only fallback — try Places when credentials exist
  try {
    const fresh = await fetchFromPlacesApi()
    if (fresh) {
      const write = await upsertCache({
        rating: fresh.rating,
        review_count: fresh.reviewCount,
        maps_url: fresh.mapsUrl,
        source: "places",
        fetched_at: new Date().toISOString(),
      })
      if (!write.ok) {
        console.error("getGoogleReviews: serving Places data but cache write failed:", write.error)
      }
      return fresh
    }
  } catch (error) {
    console.error("getGoogleReviews Places fetch:", error)
  }

  if (cachedRow) {
    return rowToBadge(cachedRow)
  }

  // Read error or empty: show fallback without writing (avoids clobbering unknown DB state).
  return fallbackReviews()
})
