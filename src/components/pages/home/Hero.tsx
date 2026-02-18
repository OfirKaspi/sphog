import Link from "next/link"
import { Store, BookHeart, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import OptimizedImage from "@/components/common/OptimizedImage"

interface HeroProps {
    title: string
    subtitle: string
    paragraphs: string[]
    ctaText?: string
    ctaLink?: string
    image: {
        src: string
        alt: string
    }
}

const Hero = ({ title, subtitle, paragraphs, image }: HeroProps) => {
    return (
        <section dir="rtl" className="w-full -mt-20 px-5 pt-32 md:pt-36 pb-12 md:pb-16 bg-gradient-to-tr from-green-100 via-background to-green-50 text-slate-900 relative overflow-hidden">
            {/* Decorative background blob */}
            <div className="absolute top-[-80px] -right-32 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-green-200 rounded-full opacity-30 blur-3xl pointer-events-none" />

            <div className="max-w-screen-lg mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-6 lg:gap-12">

                {/* Image */}
                <div className="flex-1 relative w-full max-w-md aspect-square drop-shadow-xl">
                    <OptimizedImage
                        src={image.src}
                        alt={image.alt}
                        width={720}
                        height={720}
                        crop="fit"
                        quality={100}
                        format="auto"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-3">
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto rounded-full px-6 py-5 text-base font-bold shadow-md bg-cta hover:bg-cta-foreground transition-all duration-300"
                        >
                            <Link href="/store">
                                <Store className="!size-5" />
                                לחנות
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto rounded-full px-6 py-5 text-base font-bold shadow-md border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            <Link href="/public-workshops">
                                <Globe className="!size-5" />
                                סדנאות קבוצתיות
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto rounded-full px-6 py-5 text-base font-bold shadow-md border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            <Link href="/private-workshops">
                                <BookHeart className="!size-5" />
                                סדנאות פרטיות
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
