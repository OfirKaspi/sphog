import { getPublicCatalogProducts } from "@/lib/api/catalogData"
import { homeTestimonials } from "@/lib/api/homeData"

const getStoreData = async () => {
  const products = await getPublicCatalogProducts({ regularOnly: true })
  const promoProducts = await getPublicCatalogProducts({ discountOnly: true })

  return {
    header: {
      title: "החנות שלנו",
      paragraphs: [
        "כל טרריום שלנו הוא one of a kind, פסל בוטני שעוצב ונבנה בהשראת הדמיון והתשוקה לטבע.",
        "הטרריום הסגור שלנו יוצר אקו-סיסטם מיניאטורי שמחדש את עצמו ומצריך תחזוקה מינימאלית בלבד.",
        "בכל שנה משתחררת למכירה סדרה חדשה של טרריומים שנבנו בשנה הקודמת ועברו הסתגלות ארוכה כדי לוודא שהם מותאמים ומאוזנים ויוכלו להמשיך ולשגשג עוד שנים.",
        "איזה טרריום מתאים לך?",
      ],
    },
    products,
    promoHeader: {
      title: "מבצעים מיוחדים",
    },
    promoProducts,
    testimonials: {
      title: "לקוחות מרוצים",
      testimonials: homeTestimonials.slice(0, 3),
    },
    openForm: {
      title: "רוצים לשמוע עוד?",
      description: "שלחו לנו כאן במה אתם מתעניינים ונחזור אליכם ממש מהר.",
    },
  }
}

export default getStoreData