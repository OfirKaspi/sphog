import type { Database } from "@/lib/supabase"

type LogoRow = Database["public"]["Tables"]["private_workshop_logos"]["Row"]

/** Stable comparison of logo sets (draft vs published) for "has unpublished changes" UI. */
export function privateWorkshopLogoRowsSignature(rows: LogoRow[]): string {
  return [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => `${r.image_url}|${r.image_alt}|${r.image_public_id ?? ""}`)
    .join("\n")
}

export function draftAndPublishedLogoRowsEqual(draft: LogoRow[], published: LogoRow[]): boolean {
  return privateWorkshopLogoRowsSignature(draft) === privateWorkshopLogoRowsSignature(published)
}

export { dedupeWorkshopLogosByAsset, draftHasDuplicateAsset } from "@/lib/logoAssetKey"
