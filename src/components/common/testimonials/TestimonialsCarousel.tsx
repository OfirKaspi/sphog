"use client"

import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useCallback, useEffect, useRef, useState } from "react"
import { Testimonial } from "@/types/types"
import TestimonialCard from "./TestimonialCard"

interface TestimonialsCarouselProps {
    testimonials: Testimonial[]
}

const TestimonialsCarousel = ({ testimonials }: TestimonialsCarouselProps) => {
    const autoplay = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
    )

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: "rtl" }, [autoplay.current])
    const [selectedIndex, setSelectedIndex] = useState(0)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        emblaApi.on("select", onSelect)
        onSelect()
    }, [emblaApi, onSelect])

    return (
        <>
            {/* Carousel viewport */}
            <div className="overflow-hidden mx-auto" ref={emblaRef}>
                <div className="flex w-full">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            testimonial={testimonial}
                        />
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4 gap-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${selectedIndex === index ? "bg-primary" : "bg-white"
                            }`}
                    />
                ))}
            </div>
        </>
    )
}

export default TestimonialsCarousel
