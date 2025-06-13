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
  isDesktopColumn?: boolean; // New prop to control layout
  isImageFirst?: boolean; // New prop to control image position
}

export default function AboutUs({
  isBgPrimary = true,
  isDesktopColumn = true,
  isImageFirst = true,
  title,
  paragraphs,
  media,
  link,
}: AboutUsProps) {
  return (
    <section className={`${isBgPrimary && "bg-primary text-white"}`}>
      <div
        className={`grid gap-5 md:gap-10 items-center max-w-screen-lg mx-auto ${
          isDesktopColumn ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        } ${isBgPrimary ? "py-16 px-5" : "p-5"}`}
      >
        <div
          className={`relative h-full w-full ${
            isDesktopColumn
              ? isImageFirst
                ? "row-start-1"
                : "row-start-2"
              : isImageFirst
              ? "md:col-start-1 md:row-start-1"
              : "md:col-start-2 md:row-start-1"
          }`}
        >
          {media.type === "video" ? (
            <VideoContainer
              src={media.src}
              title={media.alt}
              isPortrait={media.isPortrait || false}
            />
          ) : (
            <Image
              src={media.src}
              alt={media.alt}
              width={1000}
              height={1000}
              className="w-full h-full rounded-xl object-cover max-w-2xl mx-auto"
            />
          )}
        </div>
        <div
          className={`flex flex-col justify-center max-w-2xl mx-auto ${
            isDesktopColumn
              ? isImageFirst
                ? "row-start-2"
                : "row-start-1"
              : isImageFirst
              ? "md:col-start-2 md:row-start-1"
              : "md:col-start-1 md:row-start-1"
          }`}
        >
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
