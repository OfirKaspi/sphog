import Link from "next/link"

import CTAButton from "@/components/common/CTAButton"
import { GALLERY_CTA_LABEL } from "@/lib/constants/gallery"

type GalleryCtaLinkProps = {
  className?: string
}

/** Primary CTA linking to `/gallery` (caller should gate with isGalleryNavVisible). */
export default function GalleryCtaLink({ className = "mt-6 flex justify-center" }: GalleryCtaLinkProps) {
  return (
    <div className={className}>
      <Link href="/gallery">
        <CTAButton>{GALLERY_CTA_LABEL}</CTAButton>
      </Link>
    </div>
  )
}
