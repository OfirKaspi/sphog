"use client"

import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState } from "react"
import { Product } from "@/types/types"
import ProductItem from "@/components/pages/store/ProductItem"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useResponsive from "@/hooks/useResponsive"

interface StoreCarouselProps {
    products: Product[]
}

const StoreCarousel = ({ products }: StoreCarouselProps) => {
    const { isMobile, isDesktop } = useResponsive()
    const visibleCount = isDesktop ? 3 : isMobile ? 1 : 2
    const needsCarousel = products.length > visibleCount

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: needsCarousel,
        direction: "rtl",
        align: "start",
        slidesToScroll: 1,
        active: needsCarousel,
    })

    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        emblaApi.reInit()
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
        onSelect()
    }, [emblaApi, onSelect, needsCarousel])

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    const arrowButtonClass =
        "shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:bg-white hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"

    return (
        <div className="embla-store mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:items-center sm:gap-3">
            {needsCarousel && (
                <button
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    className={`hidden sm:flex ${arrowButtonClass}`}
                    aria-label="Previous"
                >
                    <ChevronRight className="h-5 w-5 text-gray-800" />
                </button>
            )}

            <div className="embla-store__viewport min-w-0 w-full flex-1" ref={emblaRef}>
                <div className={`embla-store__container ${!needsCarousel ? "justify-center" : ""}`}>
                    {products.map((product) => (
                        <div key={product._id} className="embla-store__slide">
                            <ProductItem
                                product={product}
                                className="w-full"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {needsCarousel && (
                <>
                    <button
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        className={`hidden sm:flex ${arrowButtonClass}`}
                        aria-label="Next"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-800" />
                    </button>

                    <div className="flex gap-4 sm:hidden">
                        <button
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                            className={arrowButtonClass}
                            aria-label="Previous"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-800" />
                        </button>
                        <button
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                            className={arrowButtonClass}
                            aria-label="Next"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-800" />
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default StoreCarousel
