const getPrivateWorkshopData = () => {
    const generateDates = () => {
        const excludedDates = ["2025-06-27", "2025-07-11", "2025-08-01"];
        const dates = [];
        const startDate = new Date("2025-06-19");
        const endDate = new Date("2025-12-31");

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const day = d.getDay(); // 0 = Sunday, 6 = Saturday
            const formattedDate = d.toISOString().split("T")[0];

            if (day !== 6 && !excludedDates.includes(formattedDate)) {
                if (day === 5) {
                    // Fridays
                    dates.push({ date: new Date(formattedDate), hours: ["11:00-14:00"] });
                } else {
                    // Weekdays
                    dates.push({
                        date: new Date(formattedDate),
                        hours: ["11:00-14:00", "14:30-17:30", "18:30-21:30"],
                    });
                }
            }
        }

        return dates;
    };

    const data = {
        header: {
            title: "רוצים לתאם סדנא רק עבורכם?",
            paragraphs: [
                "סדנאות אינטימיות לזוגות, פעילות לצוות מהעבודה, חגיגה של יום הולדת או סתם מפגש חברים",
                "בואו לסטודיו הקסום שלנו וניצור לכם סדנא שמתאימה בדיוק לכם.",
                "בסדנא תעצבו ותבנו טרריום שהוא יצירה אישית, ייחודית וקסומה.",
            ],
        },
        videoContainer: {
            src: "https://www.youtube-nocookie.com/embed/CxigKY9VeDo",
            title: "YouTube Shorts Video",
            isPortrait: false,
        },
        aboutUs: {
            title: "סדנאות פרטיות מותאמות אישית",
            paragraphs: [
                "תקבלו את כל הידע, הכלים והחומרים הדרושים כדי ליצור טרריום ייחודי וקסום.",
                "תוך כדי עבודה עם מגוון רחב של צמחים וטחבים, תחברו בין הגוף והנפש ותגלו את כוחה המרגיע של היצירה וההפתעה של היצירתיות הטמונה בכל אחד ואחת, שאותה גם לוקחים הביתה. ",
            ],
            media: {
                type: "image",
                src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749893918/sphog/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA_%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA_%D7%AA%D7%9E%D7%95%D7%A0%D7%94_%D7%9C%D7%A8%D7%9B%D7%99%D7%91_%D7%98%D7%A7%D7%A1%D7%98_no6yea.webp",
                alt: "תמונה - סדנא פרטית",
                isPortrait: true,
            },
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
            },
        ],
        workshopFormData: {
            header: {
                title: "סדנא פרטית",
                description: "בחר תאריך ושעה לסדנא פרטית מותאמת אישית.",
            },
            availableDates: generateDates(),
        },
        testimonials: {
            title: "לקוחות ממליצים",
            testimonials: [
                {
                    name: "רינה",
                    quote: "היה כיף אדיר ותענוג צרוף. מבחינתי הכל עבד מושלם! אתה מנחה כריזמטי, מוכשר, ורואים את האהבה הגדולה שלך לעשייה הזו עם כל מילה שיוצאת לך מהפה וכל עלה שאתה מחזיק ביד :) תודה רבה!!!",
                    role: "סדנת צוות",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749895609/sphog/Refine-Intelligence-webp_kujhkx.webp",
                        alt: "רינה",
                    },
                },
                {
                    name: "זיו",
                    quote: "היינו בסדנא זוגית. האווירה הייתה נעימה, קלילה ומלמדת, והיה פשוט מעולה – איל מקצועי, סבלני, עם חיוך ותשומת לב. הרגשנו לגמרי בנוח, גם לשאול שאלות וגם פשוט ליהנות מהחוויה. ממליץ בחום",
                    role: "סדנא זוגית",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/1_kawtgf.png",
                        alt: "זיו",
                    },
                },
                {
                    name: "יועד",
                    quote: "אייל מקצוען וספוג מדהימים תודה רבה על סדנא מארץ האגדות לכל חובב טבע!!! הצוות נהנה מאוד.",
                    role: "סדנת צוות",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749924324/sphog/%D7%9E%D7%9E%D7%9C%D7%99%D7%A6%D7%99%D7%9D_pqpcve.webp",
                        alt: "יועד",
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

export default getPrivateWorkshopData;