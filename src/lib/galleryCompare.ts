import type { Database } from "@/lib/supabase"

type GalleryRow = Database["public"]["Tables"]["gallery_images"]["Row"]

/** Stable comparison of gallery sets (draft vs published) for "has unpublished changes" UI. */
export function galleryImageRowsSignature(rows: GalleryRow[]): string {
  return [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => `${r.image_url}|${r.image_alt}|${r.image_public_id ?? ""}`)
    .join("\n")
}

export function draftAndPublishedGalleryRowsEqual(
  draft: GalleryRow[],
  published: GalleryRow[]
): boolean {
  return galleryImageRowsSignature(draft) === galleryImageRowsSignature(published)
}

export { dedupeWorkshopLogosByAsset as dedupeGalleryImagesByAsset, draftHasDuplicateAsset } from "@/lib/logoAssetKey"
