import { Testimonial } from '@/types/types'
import Image from 'next/image'
import React from 'react'

interface TestimonialCardProps {
    testimonial: Testimonial
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
    return (
        <div className="w-full flex-shrink-0 px-5 pt-14 pb-5 max-w-screen-sm">
            <div className="relative bg-white border rounded-lg px-6 py-12 shadow-lg h-full flex flex-col text-center gap-5 ">
                {testimonial.image && (
                    <Image
                        src={testimonial.image.src}
                        alt={testimonial.image.alt}
                        width={100}
                        height={100}
                        className="absolute bg-white h-[60px] w-fit -top-[30px] left-1/2 -translate-x-1/2 rounded-xl object-cover border-4 border-white shadow-md"
                    />
                )}
                <div>
                    <p className="md:text-lg text-primary font-semibold">{testimonial.name}</p>
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