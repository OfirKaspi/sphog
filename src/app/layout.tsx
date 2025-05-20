import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/react';
import Footer from "@/components/layout/Footer";
import AccessibilityWidget from "@/components/legal/AccessibilityWidget";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { CONFIG } from "@/config/config";
import Script from "next/script";
import GAListener from "@/components/common/GAListener";

// MUST CHANGE DETAILS, IMAGES, OR ANYTHING RELEVANT + FONTS
const RootLayout = ({ children, }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>LevelUp | סוכנות דיגיטלית לבניית אתרים, שיווק וכתיבה</title>
        <meta
          name="description"
          content="LevelUp - סוכנות דיגיטלית מובילה לבניית אתרים, שיווק דיגיטלי וכתיבה שיווקית לעסקים שרוצים להצליח."
        />
        <meta
          name="keywords"
          content="בניית אתרים, סוכנות דיגיטל, שיווק בפייסבוק, כתיבה שיווקית, דפי נחיתה, אתרי תדמית, LevelUp"
        />
        <meta property="og:title" content="LevelUp | סוכנות דיגיטלית" />
        <meta
          property="og:description"
          content="LevelUp - סוכנות דיגיטלית מובילה המספקת פתרונות מקצועיים בבניית אתרים, שיווק וכתיבה שיווקית, המקדמים עסקים להצלחה."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thelevelupagency.com/levelup-og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="he_IL" />
        <meta property="og:url" content="https://thelevelupagency.com" />
        <meta name="twitter:card" content="https://thelevelupagency.com/levelup-og-image.png" />
        <link rel="canonical" href="https://thelevelupagency.com" />
        <link
          rel="icon"
          href="/social-media/facebook.svg"
          type="image/png"
          sizes="32x32"
        />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;700&display=swap"
          rel="stylesheet"
        /> */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${CONFIG.GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
      </head>
      <body className="antialiased">
        {children}
        <Footer />
        <WhatsAppButton />
        <AccessibilityWidget />

        <GAListener />
        <Analytics />
      </body>
    </html>
  );
}

export default RootLayout;