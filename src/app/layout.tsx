import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/react';
import Footer from "@/components/layout/Footer";
import AccessibilityWidget from "@/components/legal/AccessibilityWidget";
import WhatsAppButton from "@/components/common/WhatsAppButton";
// import { CONFIG } from "@/config/config";
// import Script from "next/script";
// import GAListener from "@/components/common/GAListener";
import Navbar from "@/components/layout/Navbar";
import CookieNotice from "@/components/legal/CookieNotice";

// MUST CHANGE DETAILS, IMAGES, OR ANYTHING RELEVANT + FONTS
const RootLayout = ({ children, }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Shpog | סדנאות טרריום בהתאמה אישית</title>
        <meta
          name="description"
          content="Shpog - סדנאות טרריום ייחודיות ומותאמות אישית, חוויה יצירתית ומרגיעה לכל אירוע."
        />
        <meta
          name="keywords"
          content="סדנאות טרריום, עיצוב טרריום, סדנאות יצירה, Shpog"
        />
        <meta property="og:title" content="Shpog | סדנאות טרריום" />
        <meta
          property="og:description"
          content="Shpog - סדנאות טרריום ייחודיות ומותאמות אישית, חוויה יצירתית ומרגיעה לכל אירוע."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://sphog.vercel.app/og-image.png"/>
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="576" />
        <meta property="og:locale" content="he_IL" />
        
        {/* NEED TO BE CHANGED IN PRODUCTION */}
        <meta property="og:url" content="https://sphogmoss.com" />
        <meta name="twitter:card" content="https://sphogmoss.com/og-image.png" />
        
        {/* NEED TO BE CHANGED IN PRODUCTION */}
        <link rel="canonical" href="https://sphogmoss.com" />
        <link
          rel="icon"
          href="/logo.png"
          type="image/png"
          sizes="32x32"
        />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;700&display=swap"
          rel="stylesheet"
        /> */}
        {/* <Script
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
        </Script> */}
      </head>
      <body className="antialiased bg-background text-text font-fredoka">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <AccessibilityWidget />

        <CookieNotice/> 
        {/* <GAListener /> */}
        <Analytics />
      </body>
    </html>
  );
}

export default RootLayout;