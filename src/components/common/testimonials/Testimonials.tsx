"use client"

import TestimonialsCarousel from "@/components/common/testimonials/TestimonialsCarousel"
import useResponsive from "@/hooks/useResponsive"
import { Testimonial } from "@/types/types"
import TestimonialsGrid from "./TestimonialsGrid"

interface TestimonialProps {
  title: string
  testimonials: Testimonial[]
}

const Testimonials = ({ testimonials, title }: TestimonialProps) => {
  const { isDesktop } = useResponsive()

  return (
    <div className="mx-auto w-full py-16 max-w-screen-lg">
      <h2 className="text-3xl md:text-4xl text-primary mb-2 text-center">{title}</h2>
      {isDesktop ? (
        <TestimonialsGrid testimonials={testimonials} />
      ) : (
        <TestimonialsCarousel testimonials={testimonials} />
      )}
    </div>
  )
}

export default Testimonials
