const getAboutData = () => {
    const data = {
        header: {
            title: "אודות Sphog",
            description: "סדנאות, טיפים ומוצרים לעיצוב הבית והגינה, בהשראת טבע ויצירתיות.",
        },
        aboutMission: {
            title: "השליחות שלנו",
            subtitle: "אהבה לטבע, לאסתטיקה ולחיבור אנושי מניעה את כל מה שאנחנו עושים.",
            points: [
                "ליצור חוויות יצירתיות ושקטות שמאפשרות לאנשים להתנתק מהשגרה.",
                "לחבר בין אנשים דרך עשייה משותפת, חיבור לטבע ויצירה אישית.",
                "להנגיש כלים פשוטים שמזמינים ביטוי עצמי, רוגע וצמיחה אישית.",
                "לקדם תרבות של קהילה, מקצועיות, איכות ויחס אישי בכל סדנה."
            ]
        },
        aboutValues: {
            title: "הערכים שלנו",
            values: [
                {
                    title: "יצירתיות",
                    description: "הסדנאות שלנו מעוצבות להעניק מרחב חופשי לביטוי אישי ולדמיון."
                },
                {
                    title: "טבע",
                    description: "החומרים שלנו מגיעים מהטבע, ומביאים תחושת חיבור, שקט והרמוניה."
                },
                {
                    title: "קהילה",
                    description: "אנו מחויבים ליצירת מרחבים משותפים שמחברים בין אנשים."
                },
                {
                    title: "מקצועיות",
                    description: "הצוות שלנו מלווה כל סדנה בידע, ניסיון ותשומת לב אישית."
                }
            ]
        },
        openForm: {
            title: "מעוניינים בסדנה מותאמת אישית?",
            description: "מלאו את הפרטים ונחזור אליכם בהקדם.",
        },
        testimonials: {
            title: "המלצות",
            items: [
                {
                    name: "דנה לוי",
                    quote: "הסדנה הייתה מדהימה! התחברתי לטבע, הרגשתי חופשית ויצירתית. חוויה מרגיעה ובלתי נשכחת.",
                    role: "משתתפת בסדנת טרריום",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379392/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.39_pugj7r.jpg",
                        alt: "תמונה של דנה לוי"
                    }
                },
                {
                    name: "נועה ברק",
                    quote: "חוויה מרגשת עם צוות מקצועי ומקום קסום. ממליצה בחום לכל מי שמחפש רגע של שקט.",
                    role: "מנהלת משאבי אנוש",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379392/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.49_zblyoi.jpg",
                        alt: "תמונה של נועה ברק"
                    }
                },
                {
                    name: "גלית כהן",
                    quote: "לא ציפיתי שזה ישפיע עליי כל כך. סדנה מושקעת ומרגיעה שהשפיעה עליי גם אחרי שהסתיימה.",
                    role: "מטפלת רגשית",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379391/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.25_exulqi.jpg",
                        alt: "תמונה של גלית כהן"
                    }
                },
            ]
        }
    }

    return data
}

export default getAboutData