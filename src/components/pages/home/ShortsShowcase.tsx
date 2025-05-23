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
                <div className="relative">
                    <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[80px] h-[6px] z-10 bg-gray-300 rounded-md " />

                    <div className="absolute top-[140px] -right-[8px] -translate-x-1/2 w-[8px] h-[60px] z-10 bg-gray-300 rounded-r-md " />
                    
                    <div className="absolute top-[90px] left-0 -translate-x-1/2 w-[8px] h-[30px] z-10 bg-gray-300 rounded-l-md " />
                    <div className="absolute top-[130px] left-0 -translate-x-1/2 w-[8px] h-[40px] z-10 bg-gray-300 rounded-l-md " />
                    <div className="absolute top-[170px] left-0 -translate-x-1/2 w-[8px] h-[40px] z-10 bg-gray-300 rounded-l-md " />
                    <div className="relative flex-1 w-full max-w-[270px] aspect-[9/16] rounded-3xl border-4 border-gray-300 shadow-lg overflow-hidden">
                        <iframe
                            className="w-full h-full z-100"
                            src={youtubeShortsUrl}
                            title="YouTube Shorts Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShortsShowcase
