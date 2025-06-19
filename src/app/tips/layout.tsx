import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "טיפים ומדריכים לטרריום | Sphog",
    description:
        "טיפים, מדריכים וסרטונים קצרים שיעזרו לכם להבין איך להכין, לעצב ולשמור על הטרריום שלכם בצורה הטובה ביותר.",
    keywords: [
        "טיפים לטרריום",
        "מדריכים להכנת טרריום",
        "איך לשמור על טרריום",
        "טרריום בבית",
        "Sphog טיפים"
    ],
    openGraph: {
        title: "Sphog | טיפים ומדריכים להכנת טרריום",
        description:
            "מדריכים קצרים וסרטוני הסבר על טיפול, תחזוקה ויצירה של טרריום ביתי בקלות.",
        url: "https://sphogmoss.com/tips",
        siteName: "Sphog",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "טיפים לשמירה על טרריום בבית"
            }
        ],
        locale: "he_IL",
        type: "article"
    },
    twitter: {
        card: "summary_large_image",
        title: "טיפים לטרריום - Sphog",
        description:
            "סדרת טיפים מקצועיים להכנת טרריום – כל מה שצריך לדעת במקום אחד.",
        images: ["/og-image.png"],

    },
    icons: {
        icon: "/logo.png"
    }
}

export default function TipsLayout({ children }: { children: ReactNode }) {
    return <>{children}</>
}
