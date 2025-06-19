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
                url: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749893918/sphog/%D7%98%D7%99%D7%A4_%D7%90%D7%99%D7%9A_%D7%9C%D7%A9%D7%9E%D7%95%D7%A8_%D7%A2%D7%9C_%D7%94%D7%98%D7%A8%D7%A8%D7%99%D7%95%D7%9D_-_%D7%98%D7%A8%D7%A8%D7%99%D7%95%D7%9D_%D7%90%D7%A7%D7%93%D7%9E%D7%99_dp1rzt.webp",
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
        images: [
            "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749893918/sphog/%D7%98%D7%99%D7%A4_%D7%90%D7%99%D7%9A_%D7%9C%D7%A9%D7%9E%D7%95%D7%A8_%D7%A2%D7%9C_%D7%94%D7%98%D7%A8%D7%A8%D7%99%D7%95%D7%9D_-_%D7%98%D7%A8%D7%A8%D7%99%D7%95%D7%9D_%D7%90%D7%A7%D7%93%D7%9E%D7%99_dp1rzt.webp"
        ]
    },
    icons: {
        icon: "/logo.png"
    }
}

export default function TipsLayout({ children }: { children: ReactNode }) {
    return <>{children}</>
}
