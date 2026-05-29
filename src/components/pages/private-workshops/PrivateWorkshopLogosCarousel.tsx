"use client"

import Marquee from "react-fast-marquee"

import OptimizedImage from "@/components/common/OptimizedImage"
import { dedupeWorkshopLogosByAsset } from "@/lib/logoAssetKey"
import { cn } from "@/lib/utils"

export type PrivateWorkshopLogoItem = { id: string; src: string; alt: string }

type PrivateWorkshopLogosCarouselProps = {
  heading: string
  logos: PrivateWorkshopLogoItem[]
  className?: string
}

function splitIntoTwoRows(items: PrivateWorkshopLogoItem[]) {
  const unique = dedupeWorkshopLogosByAsset(items)
  const row1: PrivateWorkshopLogoItem[] = []
  const row2: PrivateWorkshopLogoItem[] = []

  unique.forEach((logo, index) => {
    if (index % 2 === 0) {
      row1.push(logo)
    } else {
      row2.push(logo)
    }
  })

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

  const renderLogo = (logo: PrivateWorkshopLogoItem, rowKey: string, index: number) => (
    <div
      key={`${rowKey}-${logo.id}-${index}`}
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
  )

  return (
    <section className={cn("w-full py-8", className)} dir="ltr">
      <div className="mx-auto max-w-screen-lg px-5 text-center" dir="rtl">
        <h2 className="text-3xl font-bold text-cta md:text-4xl">{heading}</h2>
      </div>
      <div className="mt-6 space-y-3">
        <Marquee autoFill gradient={false} pauseOnHover speed={32}>
          {doubled(row1).map((logo, index) => renderLogo(logo, "marquee-r1", index))}
        </Marquee>
        {row2.length > 0 ? (
          <Marquee autoFill gradient={false} pauseOnHover speed={32} direction="right">
            {doubled(row2).map((logo, index) => renderLogo(logo, "marquee-r2", index))}
          </Marquee>
        ) : null}
      </div>
    </section>
  )
}
