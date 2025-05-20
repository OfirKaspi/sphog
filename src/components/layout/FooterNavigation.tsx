"use client"

import Link from "next/link"
import { links } from "@/components/common/links"

const FooterNavigation = () => {
  return (
    <ul className="flex items-start justify-center gap-3">
      {(Array.isArray(links) ? links : []).map((link, index) => (
        <li key={link.href || index} className="underline">
          <Link href={link.href}>
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default FooterNavigation