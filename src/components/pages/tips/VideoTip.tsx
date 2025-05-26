"use client"

import Image from "next/image"

interface VideoTipProps {
    title: string
    description: string
    video: {
        src: string
        alt: string
    }
    image: {
        src: string
        alt: string
    }
}

const VideoTip = ({ title, description, video, image }: VideoTipProps) => {
    return (
        <section className="relative w-full max-w-screen-lg mx-auto py-10 flex flex-col items-center text-center">
            {/* Text Section */}
            <div className="mb-8 max-w-lg px-5">
                <h2 className="text-4xl md:text-5xl font-bold text-primary">
                    {title}
                </h2>
                <p className="md:text-lg mt-4 text-gray-700">
                    {description}
                </p>
            </div>

            {/* Laptop Image with Video */}
            <div className="relative w-full max-w-[800px] aspect-[16/9]">
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                />
                {/* Video on Laptop Screen */}
                <div className="absolute top-[8.5%] left-[16.5%] w-[67%] h-[77%]">
                    <iframe
                        className="w-full h-full z-10 rounded-lg"
                        src={video.src}
                        title={video.alt}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </section>
    )
}

export default VideoTip
