"use client"

import Link from "next/link";
import Image from "next/image";
import { WorkshopData } from "@/types/types";
import CTAButton from "@/components/common/CTAButton";

export default function WorkshopItemOld({ title, paragraphs, image, links, buttonText, scrollToForm }: WorkshopData) {
  const handleScrollToForm = () => {
    const formElement = document.getElementById("workshop-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border flex flex-col mx-auto">
      <div className="relative w-full h-[250px] sm:h-[300px]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={true}
          className="object-cover"
        />
      </div>
      <div className="p-6 flex flex-col justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl text-primary font-semibold mb-2">{title}</h2>
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
            <CTAButton onClick={handleScrollToForm}>{buttonText}</CTAButton>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
            {(links?.map((link, index) => (
              <Link key={index} href={link.href}>
                <CTAButton>{link.text}</CTAButton>
              </Link>
            )))}
          </div>
        )}
      </div>
    </div>
  );
}
