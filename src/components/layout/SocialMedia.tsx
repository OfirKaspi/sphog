"use client";

import { CONFIG } from "@/config/config";
import { redirectToPlatform } from "@/utils/redirectToPlatform";
import Image from "next/image";

const SocialMedia = () => {
  const { whatsappNumber, facebookUsername, instagramUsername, tiktokUsername, youtubeUsername } = CONFIG

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const facebookUrl = `https://www.facebook.com/${facebookUsername}`;
  const instagramUrl = `https://www.instagram.com/${instagramUsername}`;
  const youtubeUrl = `https://www.youtube.com/@${youtubeUsername}`;
  const tiktokUrl = `https://www.tiktok.com/@${tiktokUsername}`;
  

  const socials = [
    { name: "facebook", href: facebookUrl },
    { name: "instagram", href: instagramUrl },
    { name: "whatsapp", href: whatsappUrl },
    { name: "youtube", href: youtubeUrl },
    { name: "tiktok", href: tiktokUrl },
  ]

  const handleClick = (href: string) => {
    redirectToPlatform(href)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md border-[1px] border-white p-5 md:mx-auto md:w-fit md:flex-row lg:ml-0 lg:mr-auto lg:p-2">
      <span className="flex lg:hidden">השאר מחובר</span>
      <ul className="flex gap-2" role="list">
        {socials.map((social) => (
          <li
            key={social.name}
            className="rounded-md border-[1px] border-white hover:bg-primary-foreground transition-all"
            role="listitem"
          >
            <button
              type="button"
              className="relative m-2 h-8 w-8"
              onClick={() => handleClick(social.href)}
              aria-label={social.name}
            >
              <Image
                src={`/social-media/${social.name}.svg`}
                alt={`${social.name} logo`}
                fill
                sizes="32px"
                className="object-contain"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SocialMedia