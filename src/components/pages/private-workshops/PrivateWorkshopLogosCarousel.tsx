"use client"

import Marquee from "react-fast-marquee"

import OptimizedImage from "@/components/common/OptimizedImage"
import { cn } from "@/lib/utils"

export type PrivateWorkshopLogoItem = { id: string; src: string; alt: string }

type PrivateWorkshopLogosCarouselProps = {
  heading: string
  logos: PrivateWorkshopLogoItem[]
  className?: string
}

function splitIntoTwoRows(items: PrivateWorkshopLogoItem[]) {
  if (items.length === 0) {
    return { row1: [] as PrivateWorkshopLogoItem[], row2: [] as PrivateWorkshopLogoItem[] }
  }

  const mid = Math.ceil(items.length / 2)
  const row1 = items.slice(0, mid)
  let row2 = items.slice(mid)
  if (row2.length === 0) {
    row2 = [...items]
  }

  return { row1, row2 }
}

export default function PrivateWorkshopLogosCarousel({
  heading,
  logos,
  className,
}: PrivateWorkshopLogosCarouselProps) {
  if (logos.length === 0) {
    return null
  }

  const { row1, row2 } = splitIntoTwoRows(logos)

  const doubled = (row: PrivateWorkshopLogoItem[]) => [...row, ...row]

  return (
    <section className={cn("w-full py-8", className)} dir="ltr">
      <div className="mx-auto max-w-screen-lg px-5 text-center" dir="rtl">
        <h2 className="text-3xl font-bold text-cta md:text-4xl">{heading}</h2>
      </div>
      <div className="mt-6 space-y-3">
        <Marquee autoFill gradient={false} pauseOnHover speed={32}>
          {doubled(row1).map((logo, index) => (
            <div
              key={`marquee-r1-${logo.id}-${index}`}
              className="mx-6 flex h-16 w-36 shrink-0 items-center justify-center sm:mx-10 sm:w-40"
            >
              <OptimizedImage
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={64}
                crop="fit"
                quality="auto"
                className="max-h-12 w-auto object-contain"
              />
            </div>
          ))}
        </Marquee>
        <Marquee autoFill gradient={false} pauseOnHover speed={32} direction="right">
          {doubled(row2).map((logo, index) => (
            <div
              key={`marquee-r2-${logo.id}-${index}`}
              className="mx-6 flex h-16 w-36 shrink-0 items-center justify-center sm:mx-10 sm:w-40"
            >
              <OptimizedImage
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={64}
                crop="fit"
                quality="auto"
                className="max-h-12 w-auto object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
