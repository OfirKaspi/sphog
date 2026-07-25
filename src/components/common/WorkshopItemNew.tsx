"use client";

import TrackedCtaLink from "@/components/analytics/TrackedCtaLink";
import { WorkshopData, CTAColorType } from "@/types/types";
import CTAButton from "@/components/common/CTAButton";
import { trackCta } from "@/lib/metaPixel";
import OptimizedImage from "./OptimizedImage";

function ctaNameForWorkshopLink(href: string, text: string): string {
  if (href.includes("public-workshops")) return "HomeWorkshopCTA_Public"
  if (href.includes("private-workshops")) return "HomeWorkshopCTA_Private"
  return text || "WorkshopCTA"
}

export default function WorkshopItemNew({
  title,
  paragraphs,
  image,
  links,
  buttonText,
  scrollToForm,
  ctaColor = CTAColorType.DEFAULT,
  index, // Add index to determine alternating layout
}: WorkshopData & { index: number }) {

  const handleScrollToForm = () => {
    trackCta("WorkshopScrollToForm")
    const formElement = document.getElementById("workshop-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="max-w-screen-lg text-white overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto min-h-[400px]"
    >
      <div
        className={`relative w-full ${index % 2 === 0 ? "md:col-start-1 md:row-start-1" : "md:col-start-2 md:row-start-1"
          }`}
      >
        <OptimizedImage
          src={image.src}
          alt={image.alt}
          crop="fill"
          quality={90}
          format="auto"
          width={480}
          height={400}
          className="rounded-xl h-full w-full object-cover"
          priority={true}
          decoding="async"
        />
      </div>
      <div
        className={`p-6 flex flex-col justify-center gap-6 w-full border-2 border-white rounded-xl ${index % 2 === 0 ? "md:col-start-2 md:row-start-1" : "md:col-start-1 md:row-start-1"
          }`}
      >
        <div>
          <h3 className="text-xl md:text-2xl text-white font-bold mb-2">
            {title}
          </h3>
          <p className="text-sm md:text-base leading-relaxed">
            {paragraphs.map((paragraph, index) => (
              <span key={index}>
                {paragraph}
                {index < paragraphs.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
        {scrollToForm ? (
          <div className="flex flex-col gap-3 w-fit">
            <CTAButton color={ctaColor || "default"} onClick={handleScrollToForm}>{buttonText}</CTAButton>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
            {links?.map((link, index) => (
              <TrackedCtaLink
                key={index}
                href={link.href}
                ctaName={ctaNameForWorkshopLink(link.href, link.text)}
              >
                <CTAButton color={ctaColor || "default"}>{link.text}</CTAButton>
              </TrackedCtaLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
