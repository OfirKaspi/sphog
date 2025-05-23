import React from 'react'

interface IphoneShortsContainerProps {
    youtubeShortsUrl: string
}

const IphoneShortsContainer = ({ youtubeShortsUrl }: IphoneShortsContainerProps) => {
    return (
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
    )
}

export default IphoneShortsContainer