import IphoneShortsContainer from "@/components/common/IphoneShortsContainer"
import React from "react"

interface ShortsShowcaseProps {
    title: string
    mobileDescription: string
    desktopDescription: string
    youtubeShortsUrl: string
}

const ShortsShowcase = ({ title, mobileDescription, desktopDescription, youtubeShortsUrl }: ShortsShowcaseProps) => {
    return (
        <section dir="rtl" className="w-full px-4 py-16 bg-primary text-white">
            <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center gap-10">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-right">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
                    <p className="text-gray-100 max-w-xl mx-auto md:hidden">{mobileDescription}</p>
                    <p className="hidden md:block text-lg text-gray-100 max-w-xl mx-0">{desktopDescription}</p>
                </div>

                {/* Phone-shaped Video Embed */}
                <IphoneShortsContainer youtubeShortsUrl={youtubeShortsUrl}/>
            </div>
        </section>
    )
}

export default ShortsShowcase
