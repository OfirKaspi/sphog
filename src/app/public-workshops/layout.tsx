import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "סדנאות קבוצתיות ליצירת טרריום | SPHOG",
  description:
    "הצטרפו לחוויית יצירה קבוצתית ב-SPHOG: סדנאות בוטניות לעיצוב טרריום, עם טכניקות מתקדמות, השראה מהטבע וקסם בזכוכית 🌿",
  openGraph: {
    title: "סדנאות קבוצתיות ליצירת טרריום | SPHOG",
    description:
      "עיצוב טרריום בקבוצה קטנה ואינטימית – חוויה ירוקה ומרגיעה בלב העיר. סדנאות לכל גיל ולכל רמה.",
    url: "https://sphogmoss.com/public-workshop",
    images: [
      {
        url: "https://sphogmoss.com/og-workshop.png",
        width: 1200,
        height: 630,
        alt: "סדנאות קבוצתיות טרריום SPHOG",
      },
    ],
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "סדנאות קבוצתיות ליצירת טרריום | SPHOG",
    description:
      "חוויה יצירתית עם קבוצת משתתפים באווירה ירוקה ונעימה – כולל ידע, כלים, טחבים וצמחים מיוחדים.",
    images: ["https://sphogmoss.com/og-workshop.png"],
  },
  alternates: {
    canonical: "https://sphogmoss.com/public-workshop",
  },
}

export default function PublicWorkshopLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
