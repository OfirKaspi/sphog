import { Testimonial } from '@/types/types'
import React from 'react'
import OptimizedImage from '../OptimizedImage'

interface TestimonialCardProps {
    testimonial: Testimonial
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
    return (
        <div className="w-full flex-shrink-0 px-5 pt-14 pb-5 max-w-screen-sm">
            <div className="relative bg-white border rounded-lg px-6 py-12 shadow-lg h-full flex flex-col text-center gap-5 ">
                <div className="absolute w-auto h-[60px] rounded-xl bg-white -top-[30px] left-1/2 -translate-x-1/2 border-4 border-white shadow-md">
                    {testimonial.image && (
                        <OptimizedImage
                            src={testimonial.image.src}
                            alt={testimonial.image.alt}
                            width={400}
                            height={120}
                            crop="fit"
                            quality={100}
                            format="auto"
                            className='object-cover rounded-xl h-full w-full'
                        />
                    )}
                </div>
                <div>
                    <p className="md:text-lg text-primary font-bold">{testimonial.name}</p>
                    {testimonial.role && (
                        <p className="text-sm md:text-base text-slate-500 ">
                            {testimonial.role}
                        </p>
                    )}
                </div>
                <p className="text-sm md:text-base text-slate-900 leading-relaxed">
                    “{testimonial.quote}”
                </p>
            </div>
        </div>
    )
}

export default TestimonialCard