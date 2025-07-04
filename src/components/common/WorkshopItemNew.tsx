"use client";

import Link from "next/link";
import Image from "next/image";
import { WorkshopData, CTAColorType } from "@/types/types";
import CTAButton from "@/components/common/CTAButton";

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
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
              <Link key={index} href={link.href}>
                <CTAButton color={ctaColor || "default"}>{link.text}</CTAButton>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
