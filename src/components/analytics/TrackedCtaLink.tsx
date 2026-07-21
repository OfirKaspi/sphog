"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import { trackCta } from "@/lib/metaPixel"

type TrackedCtaLinkProps = {
  href: string
  ctaName: string
  className?: string
  children: ReactNode
}

/** Next Link that fires a Meta CtaClick before navigation. */
export default function TrackedCtaLink({
  href,
  ctaName,
  className,
  children,
}: TrackedCtaLinkProps) {
  return (
    <Link href={href} className={className} onClick={() => trackCta(ctaName)}>
      {children}
    </Link>
  )
}
