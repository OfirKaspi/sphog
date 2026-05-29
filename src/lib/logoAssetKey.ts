export type WorkshopLogoAssetRef = {
  src: string
  image_public_id?: string | null
}

export type LogoAssetLike = {
  src?: string
  image_url?: string
  image_public_id?: string | null
}

function toAssetRef(logo: LogoAssetLike): WorkshopLogoAssetRef {
  return {
    src: logo.src ?? logo.image_url ?? "",
    image_public_id: logo.image_public_id,
  }
}

/** Decode/trim for comparing API public_id with values parsed from URLs. */
export function normalizeCloudinaryPublicId(id: string): string {
  try {
    return decodeURIComponent(id.trim())
  } catch {
    return id.trim()
  }
}

export function extractCloudinaryPublicIdFromUrl(imageUrl: string): string | null {
  if (!imageUrl.includes("/upload/")) {
    return null
  }

  const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./?]+)?(?:\?.*)?$/)
  const captured = match?.[1]
  if (!captured) {
    return null
  }
  return normalizeCloudinaryPublicId(captured)
}

/** Normalize a logo asset to a stable dedupe key (public_id preferred, else URL). */
export function normalizeLogoAssetKey(logo: LogoAssetLike): string {
  const ref = toAssetRef(logo)
  if (ref.image_public_id) {
    return normalizeCloudinaryPublicId(ref.image_public_id)
  }
  const fromUrl = extractCloudinaryPublicIdFromUrl(ref.src)
  if (fromUrl) {
    return normalizeCloudinaryPublicId(fromUrl)
  }
  return ref.src.trim()
}

/** Keep first occurrence of each asset; preserves sort order. */
export function dedupeWorkshopLogosByAsset<T extends LogoAssetLike>(logos: T[]): T[] {
  const seen = new Set<string>()
  const result: T[] = []

  for (const logo of logos) {
    const key = normalizeLogoAssetKey(logo)
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    result.push(logo)
  }

  return result
}

/** Check if a draft row already references the same Cloudinary asset. */
export function draftHasDuplicateAsset(drafts: LogoAssetLike[], candidate: LogoAssetLike): boolean {
  const candidateKey = normalizeLogoAssetKey(candidate)
  return drafts.some((row) => normalizeLogoAssetKey(row) === candidateKey)
}
