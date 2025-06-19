import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
    title: "על SPHOG | הטרריום שעושה קסמים בבית",
    description:
        "הכירו את אייל והצוות של SPHOG – סיפור של אהבה לטבע, לעיצוב וליצירה בתוך טרריום סגור ומדהים. התחלה שהפכה לחלום מזכוכית 🌿",
    openGraph: {
        title: "על SPHOG | הטרריום שעושה קסמים בבית",
        description:
            "הצצה לסיפור מאחורי SPHOG – אהבה לטבע ולעיצוב טרריומים שמביאים את השלווה הביתה.",
        url: "https://sphogmoss.com/about",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "צוות SPHOG בסדנא",
            },
        ],
        locale: "he_IL",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "על SPHOG | הטרריום שעושה קסמים בבית",
        description:
            "סיפור ההשראה מאחורי סדנאות הטרריום של SPHOG – למי שמחפש קסם בתוך זכוכית.",
        images: ["/og-image.png"],
    },
    alternates: {
        canonical: "https://sphogmoss.com/about",
    },
}

export default function AboutLayout({ children }: { children: ReactNode }) {
    return <>{children}</>
}
