
import Carousel from "@/components/common/Carousel"
import { Testimonial } from "@/types/types"

interface TestimonialProps {
  title: string
  testimonials: Testimonial[]
}

const Testimonials = ({testimonials,title}: TestimonialProps) => {
    
  return (
    <div className="mx-auto max-w-screen-sm w-full text-center py-5">
      <h2 className="text-3xl md:text-4xl text-primary mb-2">{title}</h2>
      <Carousel testimonials={testimonials}/>
    </div>
  )
}

export default Testimonials
