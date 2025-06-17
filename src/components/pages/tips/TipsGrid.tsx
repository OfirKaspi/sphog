"use client"

import Image from "next/image"
import { Tip } from "@/types/types"
import useResponsive from "@/hooks/useResponsive"

interface TipsGridProps {
  tips: Tip[]
}

const TipsGrid = ({ tips }: TipsGridProps) => {
  const { isMobile, isTablet } = useResponsive()

  return (
    <section className="max-w-screen-lg mx-auto space-y-10 md:space-y-24 py-16 px-5">
      {tips.map((tip, idx) => {
        const isEven = idx % 2 === 0

        return (
          <div
            key={tip._id}
            className={`flex flex-col md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''} items-center gap-6 md:gap-12`}
          >
            {/* Mobile: Image with overlay and title */}
            {isMobile || isTablet ? (
              <div className="w-full space-y-5 border-b-2 pb-5">
                <div className="relative w-full h-64 rounded-xl overflow-hidden">
                  <Image
                    src={tip.image.src}
                    alt={tip.image.alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xl text-center rounded-lg px-4 py-2 leading-snug w-fit bg-black/70">
                      {tip.title}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-900 leading-relaxed text-right px-5">
                  {tip.description}
                </p>
                <div className="text-slate-900 leading-relaxed space-y-2">
                  {tip.paragraphs.map((paragraph, index) => (
                    <p key={index} className="flex items-start">
                      <span className="mx-2 text-primary">•</span>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Desktop: Image */}
                <div className="w-full md:w-1/2 h-64 md:h-80 relative rounded-xl overflow-hidden">
                  <Image
                    src={tip.image.src}
                    alt={tip.image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Desktop: Text */}
                <div className="w-full md:w-1/2 text-right space-y-4">
                  <h3 className="text-4xl text-primary">{tip.title}</h3>
                  <p className="text-slate-900 leading-relaxed">
                    {tip.description}
                  </p>
                  <div className="text-slate-900 leading-relaxed space-y-2">
                    {tip.paragraphs.map((paragraph, index) => (
                      <p key={index} className="flex items-start">
                      <span className="mx-2 text-primary">•</span>
                      {paragraph}
                      </p>
                    ))}
                  </div>
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