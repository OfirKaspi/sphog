import Image from "next/image"
import { CONFIG } from "@/config/config"
import CTAButton from "@/components/common/CTAButton"

interface HeroProps {
    title: string
    subtitle: string
    paragraphs: string[]
    ctaText: string
    ctaLink?: string
    image: {
        src: string
        alt: string
    }
}

const Hero = ({ title, subtitle, paragraphs, ctaText, ctaLink = "", image }: HeroProps) => {

    const { whatsappNumber } = CONFIG
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;

    return (
        <section dir="rtl" className="w-full -mt-20 px-5 pt-32 md:pt-36 pb-12 md:pb-16 bg-gradient-to-tr from-green-100 via-background to-green-50 text-slate-900 relative overflow-hidden">
            {/* Decorative background blob */}
            <div className="absolute top-[-80px] -right-32 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-green-200 rounded-full opacity-30 blur-3xl pointer-events-none" />

            <div className="max-w-screen-lg mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-6 lg:gap-12">

                {/* Image */}
                <div className="flex-1 relative w-full max-w-md aspect-square drop-shadow-xl">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-contain"
                        priority
                    />

                </div>
                {/* Text Content */}
                <div className="flex-1 text-center md:text-start">
                    <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight mb-6">
                        {title}<br />
                        <span className="text-primary">{subtitle}</span>
                    </h1>
                    <div className="text-lg md:text-xl text-slate-900 mb-8 max-w-xl mx-auto md:mx-0">
                        {paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>

                    <a
                        href={ctaLink ? ctaLink : whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <CTAButton>
                            {ctaText}
                        </CTAButton>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Hero
