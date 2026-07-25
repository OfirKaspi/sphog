"use client"

import { useEffect } from "react"

import { trackViewContent } from "@/lib/metaPixel"

type ViewContentTrackerProps = {
  contentName: string
}

/** Fires Meta ViewContent once when mounted on a key marketing page. */
export default function ViewContentTracker({ contentName }: ViewContentTrackerProps) {
  useEffect(() => {
    trackViewContent(contentName)
  }, [contentName])

  return null
}
