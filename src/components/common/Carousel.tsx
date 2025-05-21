"use client"

import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useCallback, useEffect, useRef, useState } from "react"
import { Testimonial } from "@/types/types"
import Image from "next/image"

interface CarouselProps {
    testimonials: Testimonial[]
}

const Carousel = ({ testimonials }: CarouselProps) => {
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
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex w-full">
                    {testimonials.map((item, index) => (
                        <div
                            key={index}
                            className="w-full flex-shrink-0 px-4 py-6"
                        >
                            <div className="bg-white border rounded-lg p-6 shadow-lg h-full flex flex-col justify-center text-start gap-5 ">
                                <div className="flex items-center gap-3 mt-auto">
                                    {item.image && (
                                        <Image
                                            src={item.image.src}
                                            alt={item.image.alt}
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="md:text-lg text-primary">{item.name}</p>
                                        {item.role && (
                                            <p className="text-sm md:text-base text-slate-500 ">
                                                {item.role}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm md:text-base text-slate-900 leading-relaxed">
                                    “{item.quote}”
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4 gap-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${selectedIndex === index ? "bg-primary" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </>
    )
}

export default Carousel
