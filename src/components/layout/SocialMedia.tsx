"use client";

import { CONFIG } from "@/config/config";
import { redirectToPlatform } from "@/utils/redirectToPlatform";
import Image from "next/image";

const SocialMedia = () => {
  const { whatsappNumber, facebookUsername, instagramUsername } = CONFIG

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const facebookUrl = `https://www.facebook.com/${facebookUsername}`;
  const instagramUrl = `https://www.instagram.com/${instagramUsername}`;

  const socials = [
    { name: "facebook", href: facebookUrl },
    { name: "instagram", href: instagramUrl },
    { name: "whatsapp", href: whatsappUrl },
  ]

  const handleClick = (href: string) => {
    redirectToPlatform(href)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 p-5 md:mx-auto md:w-fit md:flex-row lg:ml-0 lg:mr-auto lg:p-2">
      <span>השאר מחובר</span>
      <ul className="flex gap-2" role="list">
        {socials.map((social) => (
          <li
            key={social.name}
            className="rounded-md border-2"
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
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SocialMedia