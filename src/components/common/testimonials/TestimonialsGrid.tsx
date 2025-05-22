import { Testimonial } from '@/types/types'
import React from 'react'
import TestimonialCard from './TestimonialCard'

interface TestimonialsGridProps {
    testimonials: Testimonial[]
}

const TestimonialsGrid = ({ testimonials }: TestimonialsGridProps) => {
    return (
        <div className='grid grid-cols-3'>
            {testimonials.map((testimonial, index) => (
                <TestimonialCard
                    key={index}
                    testimonial={testimonial}
                />
            ))}
        </div>
    )
}

export default TestimonialsGrid