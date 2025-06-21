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
    icons: {
        icon: "/logo.png"
    }
}

export default function TipsLayout({ children }: { children: ReactNode }) {
    return <>{children}</>
}
