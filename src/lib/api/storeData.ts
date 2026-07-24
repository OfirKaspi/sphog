import { getPublicCatalogProducts } from "@/lib/api/catalogData"

const DEFAULT_TESTIMONIAL_IMAGE =
  "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/1_kawtgf.png"

const storeTestimonials = [
  {
    name: "אביגיל",
    quote:
      'מהרגע שראיתי את התמונות בגוגל היה לי ברור שזו הבחירה בשבילנו - אבל שום דבר לא הכין אותי לטרריומים המדהימים שיצרנו, קשה להאמין שכולנו הגענו בלי שום ניסיון קודם, והכל הודות להדרכה של אייל האלוף. הצוות שלנו דובר עברית ואנגלית, ואייל התאים את עצמו לכולם בצורה מושלמת, והכל בהומור, בקלילות ובזרימה וגרם לכולנו להתחבר ולהרגיש חלק מהחוויה מהרגע הראשון. מעבר לכך שהסדנא היתה חוויה מגבשת, זורמת ומצחיקה במיוחד, היא גם העניקה לנו המון ערך מוסף וחשפה אותנו לעולם מרתק, שלא הכרנו קודם. יצאנו לסופ"ש עם חיוך ענק ועם טרריומים מהממים',
    role: "סדנת צוות",
    image: {
      src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1784892577/sphog/arison_akg5pf.jpg",
      alt: "אביגיל",
    },
  },
  {
    name: "אייל",
    quote:
      "היינו זוג בסדנא קבוצתית עם עוד מספר משתתפים כיפיים שהכרנו בסדנא. היה מדהים לראות את אייל עובד איתנו, ניכר שהוא מאוד אוהב את מה שהוא עושה ונהנה לראות אנשים אחרים יוצרים יחד איתו. קשה מאוד לא להידבק בהתלהבות שלו. נהנינו מאוד וחזרנו עם 2 יצירות מיוחדות שעשינו בעצמנו. מומלץ מאוד",
    role: "זוג בסדנא קבוצתית",
    image: {
      src: DEFAULT_TESTIMONIAL_IMAGE,
      alt: "אייל",
    },
  },
  {
    name: "בן",
    quote:
      "הגענו צוות קטן לפעילות חברה. היה ממש כיף, מעניין, אווירה טובה וחיובית. ממש נהננו והטרריום יצא אש. תודה אייל היה ממש מיוחד ומהנה",
    role: "סדנת צוות",
    image: {
      src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1784892577/sphog/lightricks_vkupfg.jpg",
      alt: "בן",
    },
  },
]

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
      testimonials: storeTestimonials,
    },
    openForm: {
      title: "רוצים לשמוע עוד?",
      description: "שלחו לנו כאן במה אתם מתעניינים ונחזור אליכם ממש מהר.",
    },
  }
}

export default getStoreData
