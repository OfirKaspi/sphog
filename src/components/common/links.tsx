import {
  BookHeart,
  BookOpen,
  Globe,
  Home,
  Images,
  Newspaper,
  Store,
} from "lucide-react"
import type { ReactNode } from "react"

export type NavLink = {
  text: string
  href: string
  icon: ReactNode
}

export const links: NavLink[] = [
  { text: "בית", href: "/", icon: <Home /> },
  { text: "חנות", href: "/store", icon: <Store /> },
  { text: "סדנאות קבוצתיות", href: "/public-workshops", icon: <Globe /> },
  { text: "סדנאות פרטיות", href: "/private-workshops", icon: <BookHeart /> },
  { text: "גלריה", href: "/gallery", icon: <Images /> },
  { text: "טרריום Academy", href: "/tips", icon: <Newspaper /> },
  { text: "מי אנחנו?", href: "/about", icon: <BookOpen /> },
]

/** Nav links with optional Gallery entry (hidden when gallery is off or empty). */
export function getNavLinks(showGallery: boolean): NavLink[] {
  if (showGallery) {
    return links
  }
  return links.filter((link) => link.href !== "/gallery")
}
