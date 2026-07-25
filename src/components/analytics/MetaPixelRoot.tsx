"use client"

import { Suspense } from "react"

import MetaPixel from "@/components/analytics/MetaPixel"

/** Suspense boundary required because MetaPixel uses useSearchParams. */
export default function MetaPixelRoot() {
  return (
    <Suspense fallback={null}>
      <MetaPixel />
    </Suspense>
  )
}
