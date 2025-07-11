const getHomeData = () => {
    const data = {
        hero: {
            isEnabled: true,
            title: "Sphog טרריום וסדנאות",
            subtitle: "טבע שהוא יצירה",
            paragraphs: [
                "הצטרפו לעולם הקסום של הטרריום! ",
                "בואו לחוויה יצירתית, מרגיעה ומהנה ותבראו עולם ירוק שהוא כולו שלכם. וגם מבחר של טרריומים בעיצוב אמן לרכישה.",
            ],
            // ctaText: "אני רוצה לשמוע עוד! ",
            // ctaLink: "https://wa.me/972526855222",
            image: {
                src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749893917/sphog/%D7%93%D7%A3_%D7%94%D7%91%D7%99%D7%AA_%D7%9B%D7%95%D7%AA%D7%A8%D7%AA_zq71wk.webp",
                alt: "תמונה ראשית - טרריום"
            }
        },
        shortsShowcase: {
            isEnabled: true,
            title: "על הסדנאות שלנו",
            paragraphs: [
                "בסדנאות אנחנו מלמדים את אומנות הכנת הטרריום.",
                "השאירו את המרוץ היומיומי והלחץ מאחור ובואו לגלות עולם של שלווה ויצירה. בסדנאות הטרריום שלנו, אנחנו מזמינים אתכם להתנתק מהשגרה וליצור אומנות בוטנית חיה.",
                "גלו את הכוח המרגיע של הטרריום:",
                "בואו לשחרר את היצירתיות, ליהנות מזמן איכות ולצאת עם יצירת אמנות ירוקה שתלווה אתכם ותעורר השראה כל יום מחדש.",
            ],
            points: [
                "יצירה אישית ומרגשת: צרו פסל בוטני חי וייחודי - טרריום שכולו אתם. אנחנו נספק לכם את כל הידע הכלים והחומרים האיכותיים, אתם תביאו את ההשראה והדמיון שלכם.",
                "התנתקות ושחרור: תוך כדי עבודה עם מגוון צמחים וטחבים, תגלו איך הגוף והנפש מתחברים. תופתעו לגלות כמה רוגע ושלווה טמונים בעבודה עם הטרריום, בעיצוב ומיקרו-שתילה וממימוש של היצירתיות שבכם.",
                "קסם מתפתח: הטרריום שתכינו ימשיך להתפתח ולצמוח בביתכם, ועם כל עלה חדש, תגלו מחדש את הקסם שבו ואת החיבור המיוחד שיצרתם.",
            ],
            media: {
                type: "video",
                alt: "YouTube Shorts",
                src: "https://www.youtube-nocookie.com/embed/Pk9U9fmXw88",
                isPortrait: true
            }
        },
        workshopPreviewData: {
            isEnabled: true,
            title: "בחרו את סדנת החלומות שלכם",
            workshop: {
                paragraphs: [
                    "יש  לנו סדנאות שמתאימות למתחילים וגם למי שכבר הכין טרריום אחד או שניים.",
                    "נלמד טכניקות ליצירת עיצובים שונים וניצור פיסת עולם בתוך מיכל זכוכית  בה הרגע היפה ביותר נשמר ומתפתח יחד איתך.",
                    "אז איזו סדנא מתאימה לכם?",
                ],
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749893917/sphog/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA_%D7%A7%D7%91%D7%95%D7%A6%D7%AA%D7%99%D7%95%D7%AA_%D7%A1%D7%93%D7%A0%D7%90_%D7%9E%D7%AA%D7%A7%D7%93%D7%9E%D7%AA_pdep3p.webp",
                    alt: "תמונה של סדנא פרטית"
                },
                links: [
                    {
                        text: "להצטרף לסדנא קבוצתית",
                        href: "/public-workshops"
                    },
                    {
                        text: "לתאם סדנא פרטית",
                        href: "/private-workshops"
                    }
                ]
            },
        },
        storeTeaser: {
            isEnabled: true,
            title: "הצצה לחנות",
            // link: {
            //     text: "מעבר לחנות",
            //     href: "/store"
            // },
            products: [
                {
                    _id: 9,
                    name: "טרריום למכירה",
                    price: 1000,
                    isInStock: false,
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749929963/sphog/2-min_1_u7ojgq.jpg",
                        alt: "תמונה של טרריום"
                    },
                    description: "מבחר טרריומים מעוצבים, עם סוגי טחב, פיטוניות, שרכים מגוונים, סלגינלה יהודי נודד ועוד."
                },
            ]
        },
        tipsSection: {
            isEnabled: false,
            title: "טרריום Academy לטרריום מושלם",
            link: {
                text: "לטרריום Academy",
                href: "/tips"
            },
            tips:
                [
                    {
                        _id: 1,
                        title: "איך לשמור על הטרריום בבית",
                        description: "טרריום אוהב שקט, יציבות ואור – אבל לא שמש ישירה. הנה מה שחשוב לדעת:",
                        paragraphs: [
                            "הכי טוב להאיר בתאורת לד לבנה. אפשר גם למקם אותו במקום מואר (כמו אור שקריא בו ספר), אבל בלי שמש ישירה! רצוי מאוד בחדר מאוורר.",
                            "לרסס את הטחב והעלים רק במים מזוקקים, 1–2 פעמים בשבוע, תלוי במזג האוויר ואטימות הכלי. חשוב לא לשפוך מים ולוודא שהטרריום לא מוצף במים.",
                            "הוא אוהב טמפרטורה של 10°–25°, זה מושלם בשבילו. מעל 32° – עלול להיהרס. ותזכרו שטרריום סגור צומח לאט – וזה בדיוק הקסם 🌱",
                        ],
                        image: {
                            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824379/sphog/6_c1w4lp.jpg",
                            alt: "טרריום עם טיפות מים",
                        },
                    },
                    {
                        _id: 2,
                        title: "הטרריום שלי חולה?",
                        description: "אלו הדברים הבסיסים שאתם צריכים להיזהר מהם, ומה כדאי לעשות:",
                        paragraphs: [
                            "עובש - קורים לבנים בין העלים? פלומה לבנבנה או אפורה שמוופיעה לפתע? זה העובש שהתנגב לו ומאיים על איזון הטרריום. מה לעשות? הסירו את החלקים המלאים בעובש עם פינצטה. חטאו את המקום בעזרת קיסם אוזניים טבול במי חמצן 5% (אפשר להשיג ברשתות הפארם), אחרי אוורור של כמה דקות יש לרסס במים מזוקקים ולעקוב במשך כמה ימים שהעובש לא חזר.",
                            "ריח רע - מריח קצת כמו ריקבון או ביוב? הטרריום שלכם יצא מאיזון ואתם צריכים להוסיף קצת פחם שינטרל את הזיהום ויטהר את הסביבה.",
                        ],
                        image: {
                            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824379/sphog/7_d1gf6g.jpg",
                            alt: "בחירת צמחים לטרריום",
                        },
                    },
                    // {
                    //   _id: 3,
                    //   title: "אוורור נכון של טרריום",
                    //   description:
                    //     "מומלץ לפתוח את הטרריום הסגור אחת לשבוע ל-30 דקות כדי לאזן את הלחות ולמנוע התפתחות עובש.",
                    //   image: {
                    //     src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824381/sphog/5_qjkatd.jpg",
                    //     alt: "פתיחת טרריום לאוורור",
                    //   },
                    // },
                    // {
                    //   _id: 4,
                    //   title: "שכבות נכונות בבסיס הטרריום",
                    //   description:
                    //     "הבסיס המומלץ לטרריום כולל חצץ לניקוז, שכבת פחם פעיל לטיהור ריחות ואז אדמה איכותית. הסדר הזה קריטי לבריאות הצמחים.",
                    //   image: {
                    //     src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747811095/sphog/workshop1_xqufgq.jpg",
                    //     alt: "שכבות חצץ ואדמה בטרריום",
                    //   },
                    // },
                ],
        },
        aboutUs: {
            isEnabled: false,
            title: "שמחים להכיר אתכם",
            paragraphs: [
                "אני אייל ואני עוסק בעולמות העיצוב והטבע כל חיי.",
                "אנימטור במקצועי וחובב צמחים וטבע מילדותי תמיד אוהב להתנסות, ליצור ולגלות טכניקות וכלים חדשים. בטחב התאהבתי בבגרותי, צמח כה מיוחד ונדיר בישראל, המטהר את האוויר שאנו נושמים ובעל תכונות ייחודיות רבות. בתקופת הקורונה התגעגעתי לטבע והתחלתי לבנות טרריומים עם טחב ולשלב בהם צמחים ואלמנטים נוספים.",
                "כך התפתחתי לעיצוב ובנייה של טרריומים ותוך כדי מצאתי את עצמי נשאב למחקר מעמיק על העולם המדהים והמרתק של הטחב, ואפילו מגדל טחב מסוגים שונים.",
                "תהליך העיצוב והיצירה של הטרריום תמיד גורם לי לתחושת שלווה, אני שוקע לתוך תהליך היצירה ומוצא את עצמי מתמלא ברוגע והשראה.",
                "מקווה שגם אתם תתחברו לתשוקה שלי ותמצאו את השלווה וההשראה שלכם בטרריום ובטחב.",
            ],
            description:
                "אנחנו ב-SPHOG מאמינים ביצירה מתוך אהבה לטבע. הסדנאות שלנו נוצרו כדי לאפשר לכל אחד לבטא את היצירתיות שלו באמצעות הטרריום – יצירה טבעית, אישית ומרגיעה.",
            media: {
                type: "image",
                src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/2_kqpsha.png",
                alt: "צוות SPHOG בסדנא",
                isPortrait: false,
            },
            link: {
                text: "קראו עוד עלינו",
                href: "/about",
            }
        },
        bannerImage: {
            isEnabled: true,
            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/2_kqpsha.png",
            alt: "תמונת בית",
        },
        header: {
            isEnabled: true,
            title: "הבית שלך מתחיל כאן",
            description: "מגוון סדנאות, טרריום Academy ומוצרים לעיצוב הבית והגינה",
        },
        testimonials: {
            isEnabled: true,
            title: "לקוחות ממליצים",
            testimonials: [
                {
                    name: "קרן",
                    quote: "איזה חוויה מדהימה! אחת החוויות הכי מרתקות ויצירתיות שעברתי. סדנא מקצועית, מושקעת ומלאה באווירה נעימה ומפרגנת. כל שלב לווה בהסברים ברורים וטיפים קטנים שעושים הבדל גדול. תשומת הלב האישית והאווירה האינטימית איפשרה שפע של זמן לשאלות והתנסות מעשית אמיתית כשאייל מדריך ומכוון לאורך כל הדרך. חזרתי הביתה עם טרריום עוצר נשימה ועם כלים ורעיונות חדשים להמשך היצירה. ממליצה בחום!",
                    role: "משתתפת בסדנא קבוצתית",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/1_kawtgf.png",
                        alt: "תמונה של קרן",
                    },
                },
                {
                    name: "בר",
                    quote: "ממש נהננו! אייל מאוד חיובי, קליל וכיפי, ובאמת שהיה מדהים. כולנו נהננו מאוד ויצאנו עם טרריומים יפיפיים ותחושת סיפוק מטורפת. אני ממליצה ממש בחום, סדנה מדהימה, שווה כל אגורה. גם בשלב של קביעת התאריך כל מי שדיברתי איתם היו ממש נחמדים, ומצאו פתרונות מעולים לכל הצרכים שלנו.",
                    role: "סדנא לצוות",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/1_kawtgf.png",
                        alt: "תמונה של בר",
                    },
                },
                {
                    name: "יפתח",
                    quote: "תודה על ערב משגע, מיוחד, מרגיע וכייפי לאללה. נהניתי מכל רגע 🙏🏻",
                    role: "סדנא זוגית",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/1_kawtgf.png",
                        alt: "תמונה של יפתח",
                    },
                },
            ],
        },
        faq: {
            isEnabled: true,
            title: "שאלות נפוצות",
            questions: [
                {
                    question: "מה ההבדל בין סדנא פרטית לסדנא קבוצתית?",
                    answer: "סדנא פרטית מיועדת לקבוצות סגורות – ימי הולדת, גיבוש צוותי, זוגות וכו', ונקבעת בתיאום אישי. סדנא קבוצתית פתוחה לקהל הרחב ומתקיימת בתאריכים קבועים מראש.",
                },
                {
                    question: "האם יש צורך בידע מוקדם כדי להשתתף בסדנא?",
                    answer: "ממש לא! הסדנאות שלנו מתאימות לכולם – גם למי שלא נגע בצמח מעולם. אנחנו מדריכים אתכם שלב אחרי שלב.",
                },
                {
                    question: "כמה זמן נמשכת הסדנא?",
                    answer: "הסדנא אורכת כ-3 שעות, תלוי בגודל הקבוצה וקצב ההתקדמות.",
                },
                {
                    question: "מה כולל המחיר של הסדנא?",
                    answer: "המחיר כולל את כל החומרים הנדרשים ליצירת טרריום אישי, הדרכה מקצועית, וכלי עבודה במהלך הסדנא.",
                },
                {
                    question: "אפשר לקחת את הטרריום הביתה?",
                    answer: "בוודאי! כל משתתף יוצא מהסדנא עם טרריום שהוא הכין בעצמו.",
                },
            ]
        },
        openForm: {
            isEnabled: true,
            title: "רוצים לשמוע עוד?",
            description: "שלחו לנו כאן במה אתם מתעניינים ונחזור אליכם ממש מהר.",
        }
    }

    return data
}

export default getHomeData