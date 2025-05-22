"use client"

import Image from "next/image"
import { Tip } from "@/types/types"
import useResponsive from "@/hooks/useResponsive"

interface TipsGridProps {
  tips: Tip[]
}

const TipsGrid = ({ tips }: TipsGridProps) => {
  const { isMobile } = useResponsive()

  return (
    <section className="max-w-6xl mx-auto p-5 space-y-10 sm:space-y-24">
      {tips.map((tip, idx) => {
        const isEven = idx % 2 === 0

        return (
          <div
            key={tip.id}
            className={`flex flex-col sm:flex-row ${!isEven ? 'sm:flex-row-reverse' : ''} items-center gap-6 sm:gap-12`}
          >
            {/* Mobile: Image with overlay and title */}
            {isMobile ? (
              <div className="w-full space-y-5 border-b-2 pb-5">
                <div className="relative w-full h-64 rounded-xl overflow-hidden">
                  <Image
                    src={tip.image.src}
                    alt={tip.image.alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <h3 className="text-white text-xl text-center mx-4 pb-2 leading-snug border-b-2 w-fit">
                      {tip.title}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-900 leading-relaxed text-right px-5">
                  {tip.description}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop: Image */}
                <div className="w-full sm:w-1/2 h-64 sm:h-80 relative rounded-xl overflow-hidden">
                  <Image
                    src={tip.image.src}
                    alt={tip.image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Desktop: Text */}
                <div className="w-full sm:w-1/2 text-right space-y-4">
                  <h3 className="text-4xl text-primary">{tip.title}</h3>
                  <p className="text-slate-900 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </>
            )}
          </div>
        )
      })}
    </section>
  )
}

export default TipsGrid