"use client";

import VideoContainer from "@/components/common/VideoContainer";
import { Media } from "@/types/types";

interface VideoTipProps {
  title: string;
  description: string;
  media: Media;
}

const VideoTip = ({ title, description, media }: VideoTipProps) => {
  return (
    <section className="relative w-full bg-primary text-white ">
      <div className="max-w-screen-lg mx-auto py-16 px-5 flex flex-col items-center text-center">
        {/* Text Section */}
        <div className="mb-8 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold">{title}</h2>
          <p className="md:text-lg mt-4">{description}</p>
        </div>

        {/* Video Container */}
        <VideoContainer src={media.src} title={media.alt} isPortrait={media.isPortrait} />
      </div>
    </section>
  );
};

export default VideoTip;
