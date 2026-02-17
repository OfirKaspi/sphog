import { 
    BookHeart, 
    BookOpen, 
    Globe, 
    Home, 
    Newspaper, 
    Store
} from "lucide-react"

export const links = [
    { text: "בית", href: "/", icon: <Home />},
    { text: "חנות", href: "/store", icon: <Store /> },
    { text: "סדנאות קבוצתיות", href: "/public-workshops", icon: <Globe /> },
    { text: "סדנאות פרטיות", href: "/private-workshops", icon: <BookHeart /> },
    { text: "טרריום Academy", href: "/tips", icon: <Newspaper /> },
    { text: "מי אנחנו?", href: "/about", icon: <BookOpen /> },
]
