import type { Testimonial } from "@/types/types"

export const GALLERY_PAGE_TITLE = "מבחר טרריום שיצרו בסדנאות שלנו"

export const GALLERY_CTA_LABEL = "לראות מה יצרו בסדנאות שלנו"

export const GALLERY_DUPLICATE_MESSAGE = "תמונה זו כבר קיימת בגלריה"

const DEFAULT_TESTIMONIAL_IMAGE =
  "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/1_kawtgf.png"

export const galleryTestimonials: Testimonial[] = [
  {
    name: "אושר",
    quote:
      "הזמנתי את הסדנא לכבוד יום ההולדת לאשתי והבחירה היתה מוצלחת ביותר! אייל מעביר את החוויה בצורה הכיפית ביותר: נחמד, סבלני, זמין, עונה על שאלות, תומך ומרים. הזמן עובד במהירות, ונשארים עם מזכרת שגורפת מחמאות רבות. כזאת שאי אפשר להתעלם ממנה - מאירה ומקשטת את החדר שבו היא נמצאת. הייתי בסדנאות רבות אך מזאת הכי נהנתי, ממליץ מאוד!",
    role: "סדנא זוגית",
    image: {
      src: DEFAULT_TESTIMONIAL_IMAGE,
      alt: "אושר",
    },
  },
  {
    name: "אביגיל",
    quote: "תודה ע-נ-ק-י-ת היה פשוט מושלם מקצה לקצה!",
    role: "סדנא קבוצתית",
    image: {
      src: DEFAULT_TESTIMONIAL_IMAGE,
      alt: "אביגיל",
    },
  },
  {
    name: "דבורה",
    quote:
      "סדנא מעולה ומעשירה! נהנינו מאוד ואייל מקסים. מומלץ מאוד לכל מי שרוצה לנסות משהו חדש גם מי שחושב שהוא לא יצירתי יוצא משם עם טרריום ואוו, ומלא ידע לעשות את זה לבד בבית",
    role: "סדנת צוות",
    image: {
      // TODO: Replace with Palo Alto logo once uploaded to Cloudinary (sphog/).
      src: DEFAULT_TESTIMONIAL_IMAGE,
      alt: "דבורה",
    },
  },
]
