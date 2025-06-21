import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'החנות שלנו | Sphog',
  description: 'טרריומים סגורים למכירה מבית Sphog – עיצובים בוטניים ייחודיים, מוכנים לשגשוג בביתכם. כל טרריום עובר תקופת הסתגלות ונבדק לאיכות גבוהה ותחזוקה מינימלית.',
  keywords: ['טרריום למכירה', 'טרריום סגור', 'טרריום עיצוב לבית', 'פסל בוטני', 'סדרה שנתית טרריום'],
  alternates: {
    canonical: 'https://sphogmoss.com/store',
  },
}

export default function StoreLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
