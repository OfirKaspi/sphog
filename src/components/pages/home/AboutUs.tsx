import TrackedCtaLink from "@/components/analytics/TrackedCtaLink";
import CTAButton from "@/components/common/CTAButton";
import { Media, LinkType } from "@/types/types";
import VideoContainer from "@/components/common/VideoContainer";
import OptimizedImage from "@/components/common/OptimizedImage";

export interface AboutUsProps {
  title?: string;
  paragraphs: string[];
  media: Media;
  link?: LinkType;
  isBgPrimary?: boolean;
  isNonePaddingBottom?: boolean;
  contentAlign?: "start" | "center";
}

export default function AboutUs({
  isBgPrimary = true,
  isNonePaddingBottom = false,
  title,
  paragraphs,
  media,
  link,
  contentAlign = "start",
}: AboutUsProps) {
  const isCentered = contentAlign === "center";
  const titleAlignClass = isCentered
    ? "text-center"
    : "text-center md:text-start";
  const bodyAlignClass = isCentered
    ? "text-center"
    : "text-center md:text-start";

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
              <OptimizedImage
                src={media.src}
                alt={media.alt}
                width={700}
                height={1000}
                crop="fit"
                quality={100}
                className="object-contain rounded-xl max-h-[500px] w-fit mx-auto"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center mx-auto max-w-full">
          {title && (
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${titleAlignClass}`}>
              {title}
            </h2>
          )}
          <p className={`md:text-lg leading-relaxed ${bodyAlignClass}`}>
            {paragraphs.map((paragraph, index) => (
              <span key={index}>
                {paragraph}
                {index < paragraphs.length - 1 && <br />}
              </span>
            ))}
          </p>
          {link && (
            <TrackedCtaLink
              href={link.href}
              ctaName={link.href.includes("gallery") ? "GalleryCTA_Click" : link.text}
              className={`mt-6 w-fit ${isCentered ? "mx-auto" : "mx-auto md:mx-0 md:self-start"}`}
            >
              <CTAButton>{link.text}</CTAButton>
            </TrackedCtaLink>
          )}
        </div>
      </div>
    </section>
  );
}
