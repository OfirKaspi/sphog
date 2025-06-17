import Image from "next/image"
import Link from "next/link"
import { Home } from "lucide-react"

type Props = {
  isTextWhite?: boolean
  isLogoWhite?: boolean
  isTextShow?: boolean
  size?: number
}

const Logo = ({ isTextWhite = false,isLogoWhite = false, isTextShow = true, size = 50 }: Props) => {
  const logoLink = { text: "Home", href: "/", src: "/logo.png", icon: <Home />, alt: "Sphog Logo", title: "Sphog" }
  return (
    <Link href={logoLink.href} className={`flex items-center justify-center text-xl font-bold ${isTextWhite && "text-white"}`}>
      {isTextShow && <span className="me-2">{logoLink.title}</span>}
      <div
        className={`relative`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Image
          src={logoLink.src}
          alt={logoLink.alt}
          fill
          sizes={`${size}px`}
          className={`object-contain ${isLogoWhite ? "invert" : ""}`}
        />
      </div>
    </Link>
  )
}

export default Logo