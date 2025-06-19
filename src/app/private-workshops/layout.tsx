import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "סדנאות פרטיות ליצירת טרריום | SPHOG",
  description:
    "חוויה מותאמת אישית בסדנא פרטית ליצירת טרריום – לזוגות, חברים, ימי הולדת או צוותי עובדים. סדנא עם הדרכה, כלים, טחבים וצמחים ייחודיים בסטודיו הקסום של SPHOG.",
  openGraph: {
    title: "סדנאות פרטיות ליצירת טרריום | SPHOG",
    description:
      "עיצוב טרריום אישי ומקורי עם הדרכה מקצועית – סדנא פרטית באווירה מרגיעה ומלאת השראה.",
    url: "https://sphogmoss.com/private-workshop",
    images: [
      {
        url: "https://sphogmoss.com/og-private-workshop.png",
        width: 1200,
        height: 630,
        alt: "סדנאות פרטיות טרריום SPHOG",
      },
    ],
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "סדנאות פרטיות ליצירת טרריום | SPHOG",
    description:
      "חוויה ירוקה קסומה ואישית – סדנא פרטית ליצירת טרריום. מתאימה ליחידים, זוגות וצוותים.",
    images: ["https://sphogmoss.com/og-private-workshop.png"],
  },
  alternates: {
    canonical: "https://sphogmoss.com/private-workshop",
  },
}

export default function PrivateWorkshopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "סדנת טרריום פרטית",
            description:
              "סדנאות טרריום פרטיות מותאמות אישית – לזוגות, קבוצות קטנות, משפחות או צוותים.",
            // startDate: "2025-06-19", // Optional: next upcoming
            location: {
              "@type": "Place",
              name: "סטודיו SPHOG",
              address: {
                "@type": "PostalAddress",
                addressLocality: "תל אביב",
                addressCountry: "IL",
              },
            },
            image: ["https://sphogmoss.com/og-private-workshop.png"],
            organizer: {
              "@type": "Organization",
              name: "SPHOG",
              url: "https://sphogmoss.com",
            },
          }),
        }}
      />
    </>
  )
}
