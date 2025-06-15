import React from "react";
import VideoContainer from "@/components/common/VideoContainer";
import { Media } from "@/types/types";
import { LucideLeaf } from "lucide-react";

interface ShortsShowcaseProps {
  title?: string;
  paragraphs: string[];
  points?: string[];
  media: Media;
  isBgPrimary?: boolean;
}

const ShortsShowcase = ({
  isBgPrimary = true,
  title,
  paragraphs,
  points,
  media
}: ShortsShowcaseProps) => {
  return (
    <section className={`w-full ${isBgPrimary && "bg-primary text-white"}`}>
      <div className="px-5 py-16 max-w-screen-lg mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Text Content */}
        <div className="flex-1">
          <h2 className={`${isBgPrimary ? "text-white" : "text-primary"} text-3xl md:text-4xl font-bold mb-4 text-center md:text-start`}>{title}</h2>
          <div className="md:text-lg max-w-xl leading-relaxed mt-3 md:mt-5">
            {paragraphs.map((paragraph, index) => (
              <React.Fragment key={index}>
                <p>{paragraph}</p>
                {index === paragraphs.length - 2 && (
                  <ul className="space-y-2 py-4">
                    {points && points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <LucideLeaf className="w-5 h-5 mt-1 shrink-0 stroke-[3px]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Video Container */}
        <VideoContainer src={media.src} title={media.alt} isPortrait={media.isPortrait} />
      </div>
    </section>
  );
};

export default ShortsShowcase;
