import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
    title: "על SPHOG | הטרריום שעושה קסמים בבית",
    description:
        "הכירו את אייל והצוות של SPHOG – סיפור של אהבה לטבע, לעיצוב וליצירה בתוך טרריום סגור ומדהים. התחלה שהפכה לחלום מזכוכית 🌿",
    alternates: {
        canonical: "https://sphogmoss.com/about",
    },
}

export default function AboutLayout({ children }: { children: ReactNode }) {
    return <>{children}</>
}
