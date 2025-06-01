"use client";

import VideoContainer from "@/components/common/VideoContainer";

interface VideoTipProps {
  title: string;
  description: string;
  video: {
    src: string;
    alt: string;
    isPortrait: boolean;
  };
}

const VideoTip = ({ title, description, video }: VideoTipProps) => {
  return (
    <section className="relative w-full max-w-screen-lg mx-auto py-10 px-5 flex flex-col items-center text-center">
      {/* Text Section */}
      <div className="mb-8 max-w-lg px-5">
        <h2 className="text-4xl md:text-5xl font-bold text-primary">{title}</h2>
        <p className="md:text-lg mt-4 text-gray-700">{description}</p>
      </div>

      {/* Video Container */}
      <VideoContainer src={video.src} title={video.alt} isPortrait={video.isPortrait} />
    </section>
  );
};

export default VideoTip;
