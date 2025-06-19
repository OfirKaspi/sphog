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
    title: "Sphog | סדנאות טרריום",
    description: "סדנאות טרריום בהתאמה אישית, חוויה ירוקה ומרגיעה לכל גיל ואירוע.",
    url: "https://sphogmoss.com",
    siteName: "Sphog",
    images: [
      {
        url: "/og-image.png",
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
    images: ["/og-image.png"],
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
