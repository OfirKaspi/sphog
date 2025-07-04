import { WorkshopType, CTAColorType } from "@/types/types";

const getPublicWorkshopData = () => {
    const data = {
        header: {
            title: "מוזמנים לאחת מהסדנאות הקבוצתיות שלנו",
            paragraphs: [
                "רוצים ליצור טרריום משלכם?",
                "בואו לאחת מהסדנאות הקבוצתיות שלנו יחד עם עוד אנשים שאוהבים טבע ויצירה בדיוק כמוכם, לעצב ולבנות את הטרריום שלכם.",
                "כל טרריום הוא יצירה אישית, ייחודית וקסומה שמייצגת אתכם.",
                "תקבלו את כל הידע, הכלים והחומרים הדרושים כדי ליצור טרריום ייחודי וקסום, שישקף את מי שאתם. תוך כדי עבודה עם מגוון רחב של צמחים וטחבים, תחברו בין הגוף והנפש ותגלו את כוחה המרגיע של היצירה וההפתעה של היצירתיות הטמונה בכם, שאותה תיקחו הביתה.",
                "אפשר לבוא לבד, בזוג ואפילו חבורה.",
            ],
        },
        workshopItems: [
            {
                title: "סדנא מתקדמת לעיצוב טרריום",
                paragraphs: [
                    "נצלול לעולם הירוק והקטיפתי של הטחב ונלמד כיצד לשלב אותו בטרריום שלנו ושישגשג לאורך זמן, יחד עם מגוון צמחים מיוחדים נלמד לעצב מיקרו-נוף ייחודי ונשלב מיניאטורות עבודת יד ליצירת פסל בוטני מלא בחיים שימלא אתכם ביופי, השראה ורוגע ויישאר איתכם לאורך זמן.",
                    "מספר המקומות מוגבל ל-10 אנשים בסדנא.",
                ],
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749893917/sphog/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA_%D7%A7%D7%91%D7%95%D7%A6%D7%AA%D7%99%D7%95%D7%AA_%D7%A1%D7%93%D7%A0%D7%90_%D7%9E%D7%AA%D7%A7%D7%93%D7%9E%D7%AA_pdep3p.webp",
                    alt: "תמונה של סדנא פרטית"
                },
                buttonText: "למידע מתי הסדנאות הבאות",
                ctaColor: CTAColorType.DEFAULT,
            },
            {
                title: "טכניקות ייחודיות לעיצוב טרריום",
                paragraphs: [
                    "הסדנאות מיועדות למי שרוצה להעמיק בטכניקות העיצוב של הטרריום ולקחת את היצירה שלו לרמה הבאה. בכל סדנא נצלול לטכניקה אחרת: טראסות ירוקות בהשראת שדות האורז של המזרח הרחוק, קיר צומח וירוק שמטפס על דופן הטרריום, עמוד אבנים פראי שממנו משתרגת צמחייה שופעת ועוד.",
                    "מספר המקומות מוגבל ל-6 אנשים בסדנא.",
                ],
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749893916/sphog/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA_%D7%A7%D7%91%D7%95%D7%A6%D7%AA%D7%99%D7%95%D7%AA_%D7%98%D7%9B%D7%A0%D7%99%D7%A7%D7%95%D7%AA_%D7%99%D7%97%D7%95%D7%93%D7%99%D7%95%D7%AA_j6dihu.webp",
                    alt: "תמונה של סדנא פרטית"
                },
                buttonText: "למידע מתי הסדנאות הבאות",
                ctaColor: CTAColorType.GREEN,
            },
            {
                title: "סדנאות משפחתיות מותאמות לילדים",
                paragraphs: [
                    "מחפשים פעילות משפחתית מהנה ויצירתית? זאת ההזדמנות המושלמת לבלות זמן איכות עם הילדים והנכדים, להעשיר את הידע על עולם הצמחים, לבטא את היצירתיות המשפחתית ובסוף גם לקחת הביתה מזכרת ירוקה. בסדנא נעצב טרריום אישי ונשלב בו טחבים, צמחים ומיניאטורות עבודת יד.",
                    "מספר המקומות מוגבל ל-10 אנשים בסדנא.",
                ],
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749925406/sphog/1_hvqdd1.webp",
                    alt: "תמונה של סדנא פרטית"
                },
                buttonText: "למידע מתי הסדנאות הבאות",
                ctaColor: CTAColorType.BLUE,
            },
        ],
        workshopFormData: {
            header: {
                title: "הסדנאות הבאות שלנו",
                description: "ספרו לנו באיזה תאריך אתם מתעניינים ונשלח לכם את כל הפרטים.",
            },
            availableDates: [
                { date: new Date("2025-07-11"), hours: ["11:00-14:00"], workshop: WorkshopType.ADVANCED },
                { date: new Date("2025-07-14"), hours: ["18:00-21:00"], workshop: WorkshopType.ADVANCED },
                { date: new Date("2025-07-24"), hours: ["18:00-21:00"], workshop: WorkshopType.ADVANCED },
                { date: new Date("2025-08-01"), hours: ["11:00-14:00"], workshop: WorkshopType.ADVANCED },
                { date: new Date("2025-08-06"), hours: ["18:00-21:00"], workshop: WorkshopType.ADVANCED },
                { date: new Date("2025-08-14"), hours: ["18:00-21:00"], workshop: WorkshopType.ADVANCED },
                { date: new Date("2025-08-18"), hours: ["18:00-21:00"], workshop: WorkshopType.ADVANCED },
                { date: new Date("2025-08-22"), hours: ["11:00-14:00"], workshop: WorkshopType.ADVANCED },
                { date: new Date("2025-08-24"), hours: ["11:00-14:00"], workshop: WorkshopType.FAMILY },
                { date: new Date("2025-08-27"), hours: ["14:30-17:00"], workshop: WorkshopType.FAMILY },
                { date: new Date("2025-08-29"), hours: ["11:00-14:00"], workshop: WorkshopType.FAMILY },
            ],
        },
        testimonials: {
            title: "לקוחות ממליצים",
            testimonials: [
                {
                    name: "אריק מ.",
                    quote: "היה מושלם! הסדנא הייתה מעניינת מאוד עניינית ומובנית. אייל מקסים, הסביר יפה מאוד על הכל. סה\"כ הייתה חוויה מטורפת שאנחנו עדיין לא מעכלים, ממש אוהבים את התוצאה שיצאה זה באמת מכניס את הטבע לבית ואנחנו ממש נהננו. תודה רבה לך על הסדנא המושלמת הזו 🙏",
                    role: "3 חברים בסדנא קבוצתית",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/1_kawtgf.png",
                        alt: "אריק מ.",
                    },
                },
                {
                    name: "דניאלה",
                    quote: "היתה לנו סדנא מעולה! מאד מאד נהנינו ללמוד עם אייל את הבסיס פלוס פלוס וליצור איתו טרריומים שיצאו נפלא, ממש כמו שרצינו. אייל השקיע בנו והיה ממש כיף לעבוד איתו! מומלץ מאד מאד!",
                    role: "זוג בסדנא קבוצתית",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/1_kawtgf.png",
                        alt: "דניאלה",
                    },
                },
                {
                    name: "אביעד",
                    quote: "הסדנא הכי כיפית, מעשירה, אמנותית ובוטנית בכפפה אחת - תודה אייל על הידע, התשוקה לתחום המטריף הזה והטרריומים המופלאים שזכינו לחזור איתם, לביא לא מפסיק ללטף אותם 🤣. היה כיף, מחכים ויצירתי!",
                    role: "אבא בסדנא משפחתית",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/1_kawtgf.png",
                        alt: "אביעד",
                    },
                },
            ],
        },
        openForm: {
            title: "רוצים לשמוע עוד?",
            description: "שלחו לנו כאן במה אתם מתעניינים ונחזור אליכם ממש מהר.",
        }
    }

    return data
}

export default getPublicWorkshopData;