import { NextRequest, NextResponse } from "next/server"

import { refreshGoogleReviewsCache } from "@/lib/api/googleReviewsData"

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) {
    return false
  }

  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when the env is set.
  const auth = request.headers.get("authorization")
  return auth === `Bearer ${secret}`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await refreshGoogleReviewsCache()
    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error || "Refresh incomplete",
          rating: result.data.rating,
          reviewCount: result.data.reviewCount,
          source: result.data.source,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      rating: result.data.rating,
      reviewCount: result.data.reviewCount,
      source: result.data.source,
    })
  } catch (error) {
    console.error("refresh-google-reviews cron:", error)
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 })
  }
}
