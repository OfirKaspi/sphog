import CTAButton from "@/components/common/CTAButton";
import { Media, LinkType } from "@/types/types";
import Image from "next/image";
import VideoContainer from "@/components/common/VideoContainer";
import Link from "next/link";

export interface AboutUsProps {
  title?: string;
  paragraphs: string[];
  media: Media;
  link?: LinkType;
  isBgPrimary?: boolean;
  isNonePaddingBottom?: boolean;
}

export default function AboutUs({
  isBgPrimary = true,
  isNonePaddingBottom = false,
  title,
  paragraphs,
  media,
  link,
}: AboutUsProps) {
  return (
    <section className={`${isBgPrimary && "bg-primary text-white"} w-full overflow-hidden`}>
      <div
        className={`grid gap-10 items-center w-full max-w-screen-lg mx-auto grid-cols-1 md:grid-cols-[auto_1fr] ${isBgPrimary ? (
          "py-16 px-5"
        ) : (
          isNonePaddingBottom ? "px-5 pt-5" : "p-5"
        )
          }`}
      >
        <div className="relative h-full w-full max-w-full order-last md:order-first">
          {media.type === "video" ? (
            <VideoContainer
              src={media.src}
              title={media.alt}
              isPortrait={media.isPortrait || false}
            />
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={media.src}
                alt={media.alt}
                width={350}
                height={500}
                className="object-contain rounded-xl mx-auto"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center mx-auto max-w-full">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-start">
              {title}
            </h2>
          )}
          <p className="md:text-lg leading-relaxed">
            {paragraphs.map((paragraph, index) => (
              <span key={index}>
                {paragraph}
                {index < paragraphs.length - 1 && <br />}
              </span>
            ))}
          </p>
          {link && (
            <Link href={link.href} className="mt-6">
              <CTAButton>{link.text}</CTAButton>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
