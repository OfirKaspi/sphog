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
}

export default function AboutUs({
  isBgPrimary = true,
  title,
  paragraphs,
  media,
  link,
}: AboutUsProps) {
  return (
    <section className={`${isBgPrimary && "bg-primary text-white"}`}>
      <div
        className={`grid gap-10 items-center max-w-screen-lg mx-auto md:grid-cols-[auto_1fr] ${
          isBgPrimary ? "py-16 px-5" : "p-5"
        }`}
      >
        <div className="relative h-full w-full order-last md:order-first">
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
              className="w-fit h-fit rounded-xl object-contain max-w-2xl max-h-[500px] mx-auto"
            />
          )}
        </div>
        <div className="flex flex-col justify-center mx-auto">
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
