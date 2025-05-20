import { BookHeart, BookOpen, Globe, Home, Newspaper, Store } from "lucide-react"

export const links = [
    { text: "בית", href: "/", icon: <Home />},
    { text: "חנות", href: "/store", icon: <Store /> },
    { text: "טיפים", href: "/tips", icon: <Newspaper /> },
    { text: "סדנאות לקבוצות גדולות", href: "/public-workshops", icon: <Globe /> },
    { text: "סדנאות פרטיות", href: "/private-workshops", icon: <BookHeart /> },
    { text: "אודות", href: "/about", icon: <BookOpen /> },
]
