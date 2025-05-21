const getTipsData = () => {
  const data = {
    header: {
      title: "טיפים",
      description: "מגוון טיפים לעיצוב הבית והגינה",
    },
    tips:
      [
        {
          id: 1,
          title: "איך להשקות נכון טרריום סגור",
          description:
            "טרריום סגור דורש מעט מים – השקיה יתרה עלולה להזיק. יש לבדוק שהקירות פנימיים מכילים אדים קלים, ולהשקות רק אם נראים יובש מלא.",
          image: {
            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824379/sphog/6_c1w4lp.jpg",
            alt: "טרריום עם טיפות מים",
          },
        },
        {
          id: 2,
          title: "בחירת הצמחים המתאימים",
          description:
            "לטרריום עדיף לבחור צמחים סוקולנטים, טחבים או צמחים שאוהבים לחות. הימנעו מצמחים שדורשים שמש ישירה או מקום מאוורר מדי.",
          image: {
            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824379/sphog/7_d1gf6g.jpg",
            alt: "בחירת צמחים לטרריום",
          },
        },
        {
          id: 3,
          title: "אוורור נכון של טרריום",
          description:
            "מומלץ לפתוח את הטרריום הסגור אחת לשבוע ל-30 דקות כדי לאזן את הלחות ולמנוע התפתחות עובש.",
          image: {
            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824381/sphog/5_qjkatd.jpg",
            alt: "פתיחת טרריום לאוורור",
          },
        },
        {
          id: 4,
          title: "שכבות נכונות בבסיס הטרריום",
          description:
            "הבסיס המומלץ לטרריום כולל חצץ לניקוז, שכבת פחם פעיל לטיהור ריחות ואז אדמה איכותית. הסדר הזה קריטי לבריאות הצמחים.",
          image: {
            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747811095/sphog/workshop1_xqufgq.jpg",
            alt: "שכבות חצץ ואדמה בטרריום",
          },
        },
      ],
    testimonials: {
      title: "טיפים וידע מקצועי",
      items: [
        {
          name: "גדי הרשקוביץ",
          quote: "למדתי סוף סוף איך לטפל בעציץ כמו שצריך, תודה על ההסבר הברור!",
          role: "חובב גינון",
          image: {
            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379389/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.48.48_hajf4e.jpg",
            alt: "תמונה של גדי הרשקוביץ",
          },
        },
        {
          name: "שני לוי",
          quote: "הטיפים באתר פשוט הצילו לי את הטרריום מהתייבשות.",
          role: "משתמשת ותיקה",
          image: {
            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379391/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.25_exulqi.jpg",
            alt: "תמונה של שני לוי",
          },
        },
        {
          name: "אבי דיין",
          quote: "ניכר שמדובר באנשים מקצוענים. כל עצה הייתה בול.",
          role: "משתמש באתר",
          image: {
            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379390/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.07_xlauuw.jpg",
            alt: "תמונה של אבי דיין",
          },
        },
      ],
    },
  }

  return data
}

export default getTipsData