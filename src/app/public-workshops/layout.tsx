import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "סדנאות קבוצתיות ליצירת טרריום | SPHOG",
  description:
    "הצטרפו לחוויית יצירה קבוצתית ב-SPHOG: סדנאות בוטניות לעיצוב טרריום, עם טכניקות מתקדמות, השראה מהטבע וקסם בזכוכית 🌿",
  alternates: {
    canonical: "https://sphogmoss.com/public-workshop",
  },
}

export default function PublicWorkshopLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
