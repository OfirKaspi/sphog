"use client"

import GoogleReviewsBadge from "@/components/common/testimonials/GoogleReviewsBadge"
import TestimonialsCarousel from "@/components/common/testimonials/TestimonialsCarousel"
import TestimonialsGrid from "@/components/common/testimonials/TestimonialsGrid"
import useResponsive from "@/hooks/useResponsive"
import type { GoogleReviewsBadgeData } from "@/lib/api/googleReviewsData"
import { Testimonial } from "@/types/types"

interface TestimonialProps {
  title: string
  testimonials: Testimonial[]
  isBgPrimary?: boolean
  googleReviews?: GoogleReviewsBadgeData | null
}

const Testimonials = ({
  testimonials,
  title,
  isBgPrimary = true,
  googleReviews = null,
}: TestimonialProps) => {
  const { isDesktop } = useResponsive()
  if (!testimonials?.length) {
    return null
  }

  return (
    <section className={`${isBgPrimary && "bg-primary"} w-full`}>
      <div className="py-16 max-w-screen-lg mx-auto px-4">
        <h2
          className={`${isBgPrimary ? "text-white" : "text-primary"} text-3xl md:text-4xl font-bold mb-2 text-center`}
        >
          {title}
        </h2>
        {isDesktop ? (
          <TestimonialsGrid testimonials={testimonials} />
        ) : (
          <TestimonialsCarousel testimonials={testimonials} />
        )}
        {googleReviews ? (
          <div className="relative z-10 flex justify-center pointer-events-auto">
            <GoogleReviewsBadge reviews={googleReviews} isBgPrimary={isBgPrimary} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Testimonials
