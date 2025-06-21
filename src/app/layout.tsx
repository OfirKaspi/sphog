// app/layout.tsx

import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/layout/Footer";
import AccessibilityWidget from "@/components/legal/AccessibilityWidget";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import Navbar from "@/components/layout/Navbar";
import CookieNotice from "@/components/legal/CookieNotice";

export const metadata = {
  title: "Sphog | סדנאות טרריום בהתאמה אישית",
  description: "סדנאות טרריום ייחודיות בהתאמה אישית, חוויה מרגיעה ומחברת לטבע.",
  keywords: ["סדנאות טרריום", "טרריום", "עיצוב טרריום", "סדנאות יצירה", "Sphog"],
  metadataBase: new URL("https://sphogmoss.com"),
  openGraph: {
    title: "Sphog | סדנת טרריום ייחודית - חוויה ירוקה, עיצובית ויצירתית",
    description: "זמן איכות זוגי, צוותי או עם חברים בסטודיו קסום בתל אביב. תעצבו טרריום אישי ומרהיב - ותיקחו הביתה מזכרת יפה שממשיכה לצמוח ולהתפתח.",
    url: "https://sphogmoss.com",
    siteName: "Sphog",
    images: [
      {
        url: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1750500843/sphog/og_image_y1cltf.jpg",
        width: 1200,
        height: 630,
        alt: "Sphog Terrarium Workshop",
      },
    ],
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sphog | סדנאות טרריום",
    description: "סדנאות טרריום בהתאמה אישית, חוויה ירוקה ומרגיעה לכל גיל ואירוע.",
    images: ["https://res.cloudinary.com/dudwjf2pu/image/upload/v1750500843/sphog/og_image_y1cltf.jpg"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased bg-background text-text font-fredoka">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <AccessibilityWidget />
        <CookieNotice />
        <Analytics />

        {/* Optional: JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Sphog",
              url: "https://sphogmoss.com",
              logo: "https://sphogmoss.com/logo.png",
              description:
                "סדנאות טרריום ייחודיות בהתאמה אישית - חוויה ירוקה ומרגיעה לכל גיל ואירוע.",
              sameAs: [
                "https://www.instagram.com/sphogmoss",
                "https://www.facebook.com/sphogmoss",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
