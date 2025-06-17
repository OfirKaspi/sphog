const getAboutData = () => {
    const data = {
        pageHeader: {
            title: "שמחים להכיר אתכם",
        },
        // aboutMission: {
        //     title: "השליחות שלנו",
        //     subtitle: "אהבה לטבע, לאסתטיקה ולחיבור אנושי מניעה את כל מה שאנחנו עושים.",
        //     points: [
        //         "ליצור חוויות יצירתיות ושקטות שמאפשרות לאנשים להתנתק מהשגרה.",
        //         "לחבר בין אנשים דרך עשייה משותפת, חיבור לטבע ויצירה אישית.",
        //         "להנגיש כלים פשוטים שמזמינים ביטוי עצמי, רוגע וצמיחה אישית.",
        //         "לקדם תרבות של קהילה, מקצועיות, איכות ויחס אישי בכל סדנא."
        //     ]
        // },
        // aboutValues: {
        //     title: "הערכים שלנו",
        //     values: [
        //         {
        //             title: "יצירתיות",
        //             description: "הסדנאות שלנו מעוצבות להעניק מרחב חופשי לביטוי אישי ולדמיון."
        //         },
        //         {
        //             title: "טבע",
        //             description: "החומרים שלנו מגיעים מהטבע, ומביאים תחושת חיבור, שקט והרמוניה."
        //         },
        //         {
        //             title: "קהילה",
        //             description: "אנו מחויבים ליצירת מרחבים משותפים שמחברים בין אנשים."
        //         },
        //         {
        //             title: "מקצועיות",
        //             description: "הצוות שלנו מלווה כל סדנא בידע, ניסיון ותשומת לב אישית."
        //         }
        //     ]
        // },
        openForm: {
            title: "מעוניינים בסדנא מותאמת אישית?",
            description: "מלאו את הפרטים ונחזור אליכם בהקדם.",
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
                    name: "יועד",
                    quote: "אייל מקצוען וספוג מדהימים תודה רבה על סדנא מארץ האגדות לכל חובב טבע!!! הצוות נהנה מאוד.",
                    role: "סדנת צוות",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749924324/sphog/%D7%9E%D7%9E%D7%9C%D7%99%D7%A6%D7%99%D7%9D_pqpcve.webp",
                        alt: "יועד",
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
            ]
        },
        aboutUs: {
            paragraphs: [
                "אני אייל ואני עוסק בעולמות העיצוב והטבע כל חיי.",
                "אנימטור במקצועי וחובב צמחים וטבע מילדותי תמיד אוהב להתנסות, ליצור ולגלות טכניקות וכלים חדשים. בטחב התאהבתי בבגרותי, צמח כה מיוחד ונדיר בישראל, המטהר את האוויר שאנו נושמים ובעל תכונות ייחודיות רבות. בתקופת הקורונה התגעגעתי לטבע והתחלתי לבנות טרריומים עם טחב ולשלב בהם צמחים ואלמנטים נוספים.",
                "כך התפתחתי לעיצוב ובנייה של טרריומים ותוך כדי מצאתי את עצמי נשאב למחקר מעמיק על העולם המדהים והמרתק של הטחב, ואפילו מגדל טחב מסוגים שונים.",
                "תהליך העיצוב והיצירה של הטרריום תמיד גורם לי לתחושת שלווה, אני שוקע לתוך תהליך היצירה ומוצא את עצמי מתמלא ברוגע והשראה.",
                "מקווה שגם אתם תתחברו לתשוקה שלי ותמצאו את השלווה וההשראה שלכם בטרריום ובטחב.",
            ],
            media: {
                type: "image",
                src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749893918/sphog/%D7%A9%D7%9E%D7%97%D7%99%D7%9D_%D7%9C%D7%94%D7%9B%D7%99%D7%A8_%D7%90%D7%AA%D7%9B%D7%9D_%D7%9E%D7%99_%D7%90%D7%A0%D7%97%D7%A0%D7%95_ngbq8s.webp",
                alt: "צוות SPHOG בסדנא",
                isPortrait: false,
            },
        },
        shortsShowcase: {
            title: "מתוך התשוקה לטבע צמח לו חלום על עולם קטן בתוך זכוכית",
            paragraphs: [
                "התחלתי עם תשוקה פשוטה לעיצוב טרריומים מגוונים שימשיכו להתפתח ולרגש לאורך שנים, ולאחר שנים של ניסיון המשכתי לסדנאות הכוללות טכניקות ועיצובים שונים מתוך הידע והניסיון שצברתי לאורך הדרך.",
            ],
            media: {
                type: "video",
                src: "https://www.youtube-nocookie.com/embed/5WsxxN3fet8",
                alt: "YouTube Shorts Video",
                isPortrait: true,
            },
        },
    }

    return data
}

export default getAboutData