import Testimonials from "@/components/common/testimonials/Testimonials"
import { getGoogleReviews } from "@/lib/api/googleReviewsData"
import type { Testimonial } from "@/types/types"

type TestimonialsSectionProps = {
  title: string
  testimonials: Testimonial[]
  isBgPrimary?: boolean
  /** When false, render nothing (same as pages that gate on isEnabled). */
  isEnabled?: boolean
}

/**
 * Server wrapper: loads Google reviews once per request and passes them into
 * the client Testimonials UI (badge under the carousel/grid).
 */
export default async function TestimonialsSection({
  title,
  testimonials,
  isBgPrimary = true,
  isEnabled = true,
}: TestimonialsSectionProps) {
  if (!isEnabled || !testimonials?.length) {
    return null
  }

  const googleReviews = await getGoogleReviews()

  return (
    <Testimonials
      title={title}
      testimonials={testimonials}
      isBgPrimary={isBgPrimary}
      googleReviews={googleReviews}
    />
  )
}
