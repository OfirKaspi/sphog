"use client"

import Link from "next/link"
import { links } from "@/components/common/links"

const FooterNavigation = () => {
  return (
    <ul className="flex flex-wrap items-start justify-center gap-3 lg:max-w-[300px] xl:max-w-[600px] mx-auto">
      {(Array.isArray(links) ? links : []).map((link, index) => (
        <li
          key={link.href || index}
          className="underline whitespace-nowrap"
        >
          <Link href={link.href}>
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default FooterNavigation