"use client"

import Link from "next/link";
import Image from "next/image";
import { WorkshopData } from "@/types/types";
import CTAButton from "@/components/common/CTAButton";

export default function WorkshopItem({ title, description, image, links, buttonText, scrollToForm }: WorkshopData) {
  const handleScrollToForm = () => {
    const formElement = document.getElementById("workshop-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border flex flex-col mx-auto">
      <Image
        src={image.src}
        alt={image.alt}
        width={800}
        height={400}
        className="w-full h-full object-cover"
      />
      <div className="p-6 flex flex-col justify-between gap-6">
        <div>
          <h3 className="text-xl md:text-2xl text-primary font-semibold mb-2">{title}</h3>
          <p className="text-sm md:text-base leading-relaxed">{description}</p>
        </div>
        {scrollToForm ? (
          <div className="flex flex-col gap-3 w-fit">
            <CTAButton onClick={handleScrollToForm}>{buttonText}</CTAButton>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 md:flex-rox">
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
