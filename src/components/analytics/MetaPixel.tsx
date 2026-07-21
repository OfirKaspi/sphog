"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

import { captureAttributionFromUrl } from "@/lib/attribution"
import { getMetaPixelId, trackPageView } from "@/lib/metaPixel"

/**
 * Loads Meta Pixel, captures UTMs into sessionStorage, and fires PageView
 * on first load (via init script) + subsequent App Router navigations.
 */
export default function MetaPixel() {
  const pixelId = getMetaPixelId()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [ready, setReady] = useState(false)
  const skipInitialClientPageView = useRef(true)

  useEffect(() => {
    captureAttributionFromUrl()
  }, [pathname, searchParams])

  useEffect(() => {
    if (!pixelId || !ready) return
    if (skipInitialClientPageView.current) {
      skipInitialClientPageView.current = false
      return
    }
    trackPageView()
  }, [pixelId, ready, pathname, searchParams])

  if (!pixelId) return null

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
        `.trim(),
      }}
      onLoad={() => {
        captureAttributionFromUrl()
        setReady(true)
      }}
    />
  )
}
