import { z } from "zod"

export type FormKey = "GeneralForm" | "WSForm" | "ProductForm"

export const attributionSchema = z
  .object({
    utm_source: z.string().max(80).optional(),
    utm_medium: z.string().max(80).optional(),
    utm_campaign: z.string().max(80).optional(),
    utm_content: z.string().max(80).optional(),
    utm_term: z.string().max(80).optional(),
    fbclid: z.string().max(200).optional(),
  })
  .optional()

export type Attribution = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  fbclid?: string
}

const STORAGE_KEY = "sphog_attribution"
const MAX_FIELD_LEN = 80

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const

function sanitizeField(value: unknown, max = MAX_FIELD_LEN): string | undefined {
  if (typeof value !== "string") return undefined
  const cleaned = value.replace(/[\n\r]+/g, "").trim().slice(0, max)
  return cleaned || undefined
}

/** Parse attribution from a query string / URLSearchParams. */
export function parseAttributionFromSearchParams(
  params: URLSearchParams
): Attribution | null {
  const result: Attribution = {}
  let hasAny = false

  for (const key of UTM_KEYS) {
    const max = key === "fbclid" ? 200 : MAX_FIELD_LEN
    const value = sanitizeField(params.get(key) ?? undefined, max)
    if (value) {
      result[key] = value
      hasAny = true
    }
  }

  return hasAny ? result : null
}

/** Persist attribution in sessionStorage (client only). Merges with existing; URL wins for present keys. */
export function captureAttributionFromUrl(): Attribution | null {
  if (typeof window === "undefined") return null

  const fromUrl = parseAttributionFromSearchParams(
    new URLSearchParams(window.location.search)
  )
  const existing = getAttribution()

  if (!fromUrl && !existing) return null

  const merged: Attribution = { ...existing, ...fromUrl }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  } catch {
    // ignore quota / private mode
  }
  return merged
}

export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Attribution
    return sanitizeAttribution(parsed)
  } catch {
    return null
  }
}

/** Sanitize an attribution object (client or server). */
export function sanitizeAttribution(input: unknown): Attribution | null {
  if (!input || typeof input !== "object") return null
  const obj = input as Record<string, unknown>
  const result: Attribution = {}
  let hasAny = false

  for (const key of UTM_KEYS) {
    const max = key === "fbclid" ? 200 : MAX_FIELD_LEN
    const value = sanitizeField(obj[key], max)
    if (value) {
      result[key] = value
      hasAny = true
    }
  }

  return hasAny ? result : null
}

export function hasUtmParams(attr: Attribution | null | undefined): boolean {
  if (!attr) return false
  return Boolean(
    attr.utm_source ||
      attr.utm_medium ||
      attr.utm_campaign ||
      attr.utm_content ||
      attr.utm_term
  )
}

/**
 * Monday Lead Source is a status column with fixed labels.
 * Map common UTM sources onto those labels (see Monday board statuses).
 */
const MONDAY_LEAD_SOURCE_LABELS = [
  "Facebook",
  "Website",
  "Whatsap",
  "Insta",
  "Email",
  "אתר בסלון",
] as const

export function formatMondayLeadSource(attr: Attribution | null | undefined): string {
  const raw = sanitizeField(attr?.utm_source, 100)
  if (!raw) return "Website"

  const key = raw.toLowerCase()
  if (key === "facebook" || key === "fb" || key === "meta") return "Facebook"
  if (key === "instagram" || key === "ig" || key === "insta") return "Insta"
  if (key === "whatsapp" || key === "wa" || key === "whatsap") return "Whatsap"
  if (key === "email" || key === "mail") return "Email"
  if (key === "website" || key === "site" || key === "organic" || key === "direct") {
    return "Website"
  }

  // Exact match on known Monday labels (case-insensitive for Latin ones)
  const exact = MONDAY_LEAD_SOURCE_LABELS.find(
    (label) => label.toLowerCase() === key || label === raw
  )
  if (exact) return exact

  // Unknown paid sources still land as Website so the lead is created;
  // the full UTM detail remains in dedicated text columns.
  return "Website"
}

/**
 * Monday Campaign (`dup__of_channel__1`) is a status column with fixed labels.
 * Keep the existing board values; raw UTM campaign goes to dedicated text columns
 * via `buildMondayUtmTextColumns`.
 *
 * Prefer `{ index }` for WSForm: Monday's label lookup rejects the "WSForm" string
 * even though index 10 exists on the board (ColumnValueException / missingLabel).
 */
export type MondayStatusValue = { label: string } | { index: number }

export function formatMondayCampaign(formKey: FormKey): MondayStatusValue {
  if (formKey === "WSForm") return { index: 10 }
  // Board label is historically "General form" (lowercase f)
  return { label: "General form" }
}

/** Hardcoded Monday text column IDs for raw UTM fields (allowlist only). */
export const MONDAY_UTM_TEXT_COLUMNS = {
  source: "text_mm5jmaya",
  medium: "text_mm5j8bxx",
  campaign: "text_mm5jbdcv",
  content: "text_mm5j8tnm",
} as const

export type MondayUtmTextColumns = {
  [MONDAY_UTM_TEXT_COLUMNS.source]?: string
  [MONDAY_UTM_TEXT_COLUMNS.medium]?: string
  [MONDAY_UTM_TEXT_COLUMNS.campaign]?: string
  [MONDAY_UTM_TEXT_COLUMNS.content]?: string
}

/**
 * Map sanitized attribution onto the four dedicated Monday UTM text columns.
 * Field-by-field only — never spreads client objects; ignores utm_term / fbclid.
 * Expects `attr` already passed through `sanitizeAttribution`.
 */
export function buildMondayUtmTextColumns(
  attr: Attribution | null | undefined
): MondayUtmTextColumns {
  if (!attr) return {}

  const columns: MondayUtmTextColumns = {}
  if (attr.utm_source) columns[MONDAY_UTM_TEXT_COLUMNS.source] = attr.utm_source
  if (attr.utm_medium) columns[MONDAY_UTM_TEXT_COLUMNS.medium] = attr.utm_medium
  if (attr.utm_campaign) columns[MONDAY_UTM_TEXT_COLUMNS.campaign] = attr.utm_campaign
  if (attr.utm_content) columns[MONDAY_UTM_TEXT_COLUMNS.content] = attr.utm_content
  return columns
}

/** Plain-text block for product-lead emails. */
export function formatAttributionEmailBlock(
  attr: Attribution | null | undefined
): string {
  if (!attr || (!hasUtmParams(attr) && !attr.fbclid)) {
    return "מקור: אתר (ללא UTM)"
  }

  const lines = [
    attr.utm_source && `utm_source: ${attr.utm_source}`,
    attr.utm_medium && `utm_medium: ${attr.utm_medium}`,
    attr.utm_campaign && `utm_campaign: ${attr.utm_campaign}`,
    attr.utm_content && `utm_content: ${attr.utm_content}`,
    attr.utm_term && `utm_term: ${attr.utm_term}`,
    attr.fbclid && `fbclid: ${attr.fbclid.slice(0, 40)}`,
  ].filter(Boolean)

  return lines.join("\n")
}
