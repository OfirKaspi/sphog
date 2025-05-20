"use client";

import Image from "next/image";
import LevelUpLogo from "@/assets/levelup-logo.png";
import { ImageSectionType } from "@/types/types";
import LeaveDetailsDialog from "@/components/forms/leave-details-form/LeaveDetailsFormDialog";

interface ImageSectionProps {
  data: ImageSectionType;
}

const ImageSection = ({ data }: ImageSectionProps) => {
  const { desc, header, buttonText, src, alt } = data;

  return (
    <section className="relative w-screen -mx-5">
      {/* Full-screen background image */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 ">
        <Image
          src={src}
          alt={alt || "background image"}
          fill
          className="object-cover"
          style={{
            objectPosition: "top",
          }}
        />
      </div>

      {/* Centered content container */}
      <div className="relative flex flex-col items-center justify-center text-center space-y-5 px-5 py-14  max-w-screen-sm md:max-w-screen-md mx-auto">
        {/* Optional Icon */}
        {buttonText && (
            <Image
              src={LevelUpLogo}
              alt="Level Up image"
              width={80}
              height={1}
              className="object-contain w-[80px] h-auto"
            />
        )}

        {/* Header and Description */}
        <div className="space-y-3 text-white">
          <h2 style={{ textShadow: '2px 6px 4px rgba(0, 0, 0, 1)' }} className="text-2xl lg:text-3xl font-bold">{header}</h2>
          <p style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 1)' }} className="lg:text-lg">{desc}</p>
        </div>

        {/* Button */}
        {buttonText && (
          <div >
            <LeaveDetailsDialog text={buttonText} isDark={false}/>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageSection;
