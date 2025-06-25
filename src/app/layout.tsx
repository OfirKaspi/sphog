// app/layout.tsx

import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/layout/Footer";
import AccessibilityWidget from "@/components/legal/AccessibilityWidget";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import Navbar from "@/components/layout/Navbar";
import CookieNotice from "@/components/legal/CookieNotice";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="google-site-verification" content="G7SewZLWCAWM1NrPBh8IgNvzzkJyLUFMT3QyHXGuVuw" />
        <meta name="google-site-verification" content="6uzj0VDyGSEYwFla9yPnbnE9PkCC1aj3xDWNUIY81VM" />
      </head>
      <body className="antialiased bg-background text-text font-fredoka">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <AccessibilityWidget />
        <CookieNotice />
        <Analytics />
      </body>
    </html>
  );
}
