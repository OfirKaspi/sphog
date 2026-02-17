export function normalizeCatalogName(value: string) {
  return value.trim().replace(/\s+/g, " ")
}

export function buildCatalogSlug(name: string) {
  const base = normalizeCatalogName(name)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return base || `product-${Date.now().toString(36)}`
}

export function buildCatalogImageAlt(name: string) {
  const normalized = normalizeCatalogName(name)
  return normalized || "תמונת מוצר"
}
