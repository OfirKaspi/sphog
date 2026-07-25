"use client"

import TrackedCtaLink from "@/components/analytics/TrackedCtaLink"
import CTAButton from "@/components/common/CTAButton"
import { GALLERY_CTA_LABEL } from "@/lib/constants/gallery"
import { CTAColorType } from "@/types/types"

type GalleryCtaLinkProps = {
  className?: string
  color?: CTAColorType
}

/** Primary CTA linking to `/gallery` (caller should gate with isGalleryNavVisible). */
export default function GalleryCtaLink({
  className = "mt-6 flex justify-center",
  color = CTAColorType.DEFAULT,
}: GalleryCtaLinkProps) {
  return (
    <div className={className}>
      <TrackedCtaLink href="/gallery" ctaName="GalleryCTA_Click">
        <CTAButton color={color}>{GALLERY_CTA_LABEL}</CTAButton>
      </TrackedCtaLink>
    </div>
  )
}
