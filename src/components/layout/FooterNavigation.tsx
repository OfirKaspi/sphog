"use client"

import Link from "next/link"
import { useMemo } from "react"

import { getNavLinks } from "@/components/common/links"

type FooterNavigationProps = {
  showGallery?: boolean
}

const FooterNavigation = ({ showGallery = false }: FooterNavigationProps) => {
  const navLinks = useMemo(() => getNavLinks(showGallery), [showGallery])

  return (
    <ul className="flex flex-wrap items-start justify-center gap-3 lg:max-w-[300px] xl:max-w-[600px] mx-auto">
      {navLinks.map((link, index) => (
        <li key={link.href || index} className="underline whitespace-nowrap">
          <Link href={link.href}>{link.text}</Link>
        </li>
      ))}
    </ul>
  )
}

export default FooterNavigation
