import type { FormKey } from "@/lib/attribution"

type FbqCommand = "track" | "trackCustom" | "init"

declare global {
  interface Window {
    fbq?: (
      command: FbqCommand | "trackSingle" | string,
      eventOrId?: string,
      params?: Record<string, unknown>
    ) => void
    _fbq?: unknown
  }
}

function canTrack(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function"
}

/**
 * Fire immediately if fbq is ready; otherwise retry briefly so early
 * ViewContent / CTA events are not dropped before the pixel script loads.
 */
function withFbq(run: () => void): void {
  if (typeof window === "undefined") return
  if (canTrack()) {
    run()
    return
  }

  let attempts = 0
  const maxAttempts = 40 // ~2s
  const timer = window.setInterval(() => {
    attempts += 1
    if (canTrack()) {
      window.clearInterval(timer)
      run()
      return
    }
    if (attempts >= maxAttempts) {
      window.clearInterval(timer)
    }
  }, 50)
}

export function trackPageView(): void {
  withFbq(() => window.fbq!("track", "PageView"))
}

export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>
): void {
  withFbq(() => window.fbq!("track", event, params))
}

export function trackMetaCustom(
  event: string,
  params?: Record<string, unknown>
): void {
  withFbq(() => window.fbq!("trackCustom", event, params))
}

export function trackLead(formKey: FormKey): void {
  trackMetaEvent("Lead", { content_name: formKey })
}

export function trackContact(method: "whatsapp" | "phone"): void {
  trackMetaEvent("Contact", { content_name: method })
}

export function trackViewContent(contentName: string): void {
  trackMetaEvent("ViewContent", { content_name: contentName })
}

export function trackCta(ctaName: string, pagePath?: string): void {
  const path =
    pagePath ??
    (typeof window !== "undefined" ? window.location.pathname : undefined)
  trackMetaCustom("CtaClick", {
    cta_name: ctaName,
    page_path: path,
  })
}

export function trackSocialClick(platform: string): void {
  trackMetaCustom("SocialClick", { platform })
}

export function getMetaPixelId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()
  return id || undefined
}
