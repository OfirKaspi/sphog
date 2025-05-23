import { Mission } from "@/types/types"
import { LucideLeaf } from "lucide-react"
import Image from "next/image"

export default function AboutMission({ title, subtitle, points }: Mission) {
  return (
    <section className="max-w-screen-lg mx-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-lg">
        <Image
          src="https://res.cloudinary.com/dudwjf2pu/image/upload/v1747811095/sphog/workshop1_xqufgq.jpg"
          alt="סדנה עם אנשים יוצרים"
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-5 md:space-y-10">
        <header className="text-center md:text-start"> 
          <h2 className="text-3xl md:text-4xl text-primary mb-2">{title}</h2>
          {subtitle && <p className="md:text-lg text-slate-900 leading-relaxed">{subtitle}</p>}
        </header>

        <ul className="space-y-4">
          {points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-900">
              <LucideLeaf className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span className="text-sm md:text-base leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}