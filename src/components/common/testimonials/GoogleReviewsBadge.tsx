"use client"

import type { GoogleReviewsBadgeData } from "@/lib/api/googleReviewsData"
import { trackCta } from "@/lib/metaPixel"

type GoogleReviewsBadgeProps = {
  reviews: GoogleReviewsBadgeData
  /** Match Testimonials section contrast on primary vs light backgrounds. */
  isBgPrimary?: boolean
}

function GoogleMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
          <path
            d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.27 5.06 16.7l.94-5.5-4-3.9 5.53-.8L10 1.5z"
            className={index < filled ? "fill-amber-400" : "fill-slate-200"}
          />
        </svg>
      ))}
    </span>
  )
}

/** Client-side fallback — Sphog official Maps short link. */
function defaultMapsHref() {
  return "https://maps.app.goo.gl/vab9eWxxaSwFav9s6"
}

export default function GoogleReviewsBadge({
  reviews,
  isBgPrimary = true,
}: GoogleReviewsBadgeProps) {
  const countLabel =
    reviews.source === "fallback"
      ? "50+ ביקורות"
      : reviews.reviewCount === 1
        ? "ביקורת אחת"
        : `${reviews.reviewCount.toLocaleString("he-IL")} ביקורות`

  const mapsUrl = reviews.mapsUrl?.trim() || defaultMapsHref()
  const ariaLabel = `דירוג Google ${reviews.rating.toFixed(1)} מתוך 5, ${countLabel} — לצפייה ולכתיבת ביקורת בגוגל`

  const shellClass = isBgPrimary
    ? "bg-white text-slate-800 shadow-md ring-1 ring-black/5 hover:bg-slate-50 hover:shadow-lg"
    : "bg-white text-slate-800 shadow-md ring-1 ring-black/10 hover:bg-slate-50 hover:shadow-lg"

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCta("GoogleReviews_Click")}
      className={`relative z-10 mt-8 inline-flex max-w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${shellClass} ${
        isBgPrimary ? "focus-visible:ring-white" : "focus-visible:ring-primary"
      }`}
      aria-label={ariaLabel}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
        <GoogleMark className="h-5 w-5" />
      </span>
      <span className="flex min-w-0 flex-col items-start gap-0.5 text-start">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold tracking-tight">Google</span>
          <Stars rating={reviews.rating} />
          <span className="text-sm font-semibold tabular-nums">{reviews.rating.toFixed(1)}</span>
        </span>
        <span className="text-xs text-slate-600 sm:text-sm">
          {countLabel}
          <span className="mx-1 text-slate-300" aria-hidden>
            ·
          </span>
          צפייה ודירוג בגוגל
        </span>
      </span>
    </a>
  )
}
