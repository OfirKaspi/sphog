import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'החנות שלנו | Sphog',
  description: 'טרריומים סגורים למכירה מבית Sphog – עיצובים בוטניים ייחודיים, מוכנים לשגשוג בביתכם. כל טרריום עובר תקופת הסתגלות ונבדק לאיכות גבוהה ותחזוקה מינימלית.',
  keywords: ['טרריום למכירה', 'טרריום סגור', 'טרריום עיצוב לבית', 'פסל בוטני', 'סדרה שנתית טרריום'],
  openGraph: {
    title: 'החנות שלנו | Sphog',
    description: 'טרריומים סגורים בעיצוב אישי, עם טחב, פיטוניות, שרכים ועוד – עכשיו במבצע!',
    type: 'website',
    locale: 'he_IL',
    url: 'https://sphogmoss.com/store',
    images: [
      {
        url: 'https://res.cloudinary.com/dudwjf2pu/image/upload/v1749929963/sphog/2-min_1_u7ojgq.jpg',
        width: 1080,
        height: 1080,
        alt: 'טרריום למכירה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sphog | טרריום בעיצוב אישי',
    description: 'גלו את הטרריומים האמנותיים שלנו – כל טרריום סגור נבנה באהבה, עובר הסתגלות ומוכן לשגשוג.',
    images: ['https://res.cloudinary.com/dudwjf2pu/image/upload/v1749929963/sphog/2-min_1_u7ojgq.jpg'],
  },
  alternates: {
    canonical: 'https://sphogmoss.com/store',
  },
}

export default function StoreLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
