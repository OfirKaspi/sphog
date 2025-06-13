"use client"

import TestimonialsCarousel from "@/components/common/testimonials/TestimonialsCarousel"
import useResponsive from "@/hooks/useResponsive"
import { Testimonial } from "@/types/types"
import TestimonialsGrid from "./TestimonialsGrid"

interface TestimonialProps {
  title: string
  testimonials: Testimonial[]
  isBgPrimary?: boolean
}

const Testimonials = ({ testimonials, title, isBgPrimary = true }: TestimonialProps) => {
  const { isDesktop } = useResponsive()

  return (
    <section className={`${isBgPrimary && "bg-primary"} w-full`}>
      <div className="py-16 max-w-screen-lg mx-auto">
        <h2 className={`${isBgPrimary ? "text-white" : "text-primary"} text-3xl md:text-4xl font-bold mb-2 text-center`}>{title}</h2>
        {isDesktop ? (
          <TestimonialsGrid testimonials={testimonials} />
        ) : (
          <TestimonialsCarousel testimonials={testimonials} />
        )}
      </div>
    </section>
  )
}

export default Testimonials
