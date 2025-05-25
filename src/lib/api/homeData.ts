const getHomeData = () => {
    const data = {
        hero: {
            title: "צור יצירת טבע חיה.",
            subtitle: "סדנאות טרריום",
            description: "הצטרפו לחוויה ירוקה, יצירתית ומהנה. מושלם ליחידים, זוגות, או גיבוש צוותים. אין צורך בניסיון קודם!",
            ctaText: "צרו קשר עוד היום!",
            // ctaLink: "https://wa.me/972526855222",
            image: {
                src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747997793/sphog/glass-terrarium-with-succulents-and-greenery-free-png_hprg6n.webp",
                alt: "תמונה ראשית - טרריום"
            }
        },
        shortsShowcase: {
            title: "הצצה לסדנה שלנו",
            mobileDescription: "רוצים לראות איך זה נראה מקרוב? צפו ברגע קצר מהסדנה הקסומה שלנו.",
            desktopDescription: `בסדנאות הטרריום שלנו, כל משתתף יוצר עולם ירוק ואישי בתוך צנצנת זכוכית. 
                                החוויה מתאימה לכל גיל ולכל אירוע — ימי הולדת, פעילויות זוגיות, גיבוש צוותים ואפילו מתנות מקוריות. 
                                אנחנו מספקים את כל הציוד, ההנחיה וההשראה. 
                                הצטרפו אלינו ליצירה טבעית, חווייתית, עם ערך אקולוגי ונגיעה אישית — זה הרבה יותר מסתם סדנה.`,
            youtubeShortsUrl: "https://www.youtube.com/embed/5WsxxN3fet8"
        },
        workshopPreviewData: {
            title: "בחרו את סדנת החלומות שלכם",
            workshops: [
                {
                    title: "סדנה פרטית",
                    description: "סדנאות אינטימיות לזוגות, ימי הולדת או גיבושים פרטיים. חוויה אישית וייחודית עם כל תשומת הלב עליכם.",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824381/sphog/5_qjkatd.jpg",
                        alt: "תמונה של סדנה פרטית"
                    },
                    link: {
                        text: "למידע נוסף על סדנאות פרטיות",
                        href: "/private-workshops"
                    }
                },
                {
                    title: "סדנה לקבוצות גדולות",
                    description: "סדנאות קבוצתיות עם אנשים נוספים שאוהבים טבע ויצירה בדיוק כמוכם. מתאים לכל הגילאים.",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747811095/sphog/workshop1_xqufgq.jpg",
                        alt: "תמונה של סדנה לקבוצות גדולות"
                    },
                    link: {
                        text: "למידע נוסף על סדנאות לקבוצות גדולות",
                        href: "/public-workshops"
                    }
                    // link: "/public-workshops",
                },
            ],
        },
        storeTeaser: {
            title: "הצצה לחנות",
            link: {
                text: "מעבר לחנות",
                href: "/store"
            },
            products: [
                {
                    _id: 2,
                    name: "ערכת טרריום למתחילים",
                    description: "כל מה שצריך כדי להתחיל ליצור טרריום בבית – כולל כלים, אדמה, צמחייה והסברים.",
                    isInStock: true,
                    price: 129.99,
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761469/sphog/small-terrarium-glass-jar-with-cork-top_pz3j3b.jpg",
                        alt: "ערכת טרריום למתחילים",
                    },
                },
                {
                    _id: 1,
                    name: "טרריום מוכן בעבודת יד",
                    description: "טרריום ייחודי ומוכן מראש, מתאים למתנה או לעיצוב הבית בצורה טבעית.",
                    isInStock: true,
                    price: 99.99,
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761471/sphog/glass-vase-with-rocks-plants-white-clear-surface-png-transparent-background_dc7dqm.jpg",
                        alt: "טרריום מוכן בעבודת יד",
                    },
                },
                {
                    _id: 3,
                    name: "אקססוריז לטרריום",
                    isInStock: true,
                    price: 49.99,
                    description: "פריטים משלימים ליצירת טרריום אישי: אבנים, פסלונים קטנים, כלים ועוד.",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761470/sphog/modern-glass-terrarium-filled-with-succulents_nwmyth.jpg",
                        alt: "אביזרים לטרריום",
                    },
                },
            ]
        },
        tipsSection:{
            title: "טיפים לטרריום מושלם",
            link: {
                text: "לטיפים נוספים",
                href: "/tips"
            },
            tips:[
                {
                    _id: 1,
                    title: "איך להשקות נכון טרריום סגור",
                    description:
                        "טרריום סגור דורש מעט מים – השקיה יתרה עלולה להזיק. יש לבדוק שהקירות פנימיים מכילים אדים קלים, ולהשקות רק אם נראים יובש מלא.",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824379/sphog/6_c1w4lp.jpg",
                        alt: "טרריום עם טיפות מים",
                    },
                },
                {
                    _id: 2,
                    title: "בחירת הצמחים המתאימים",
                    description:
                        "לטרריום עדיף לבחור צמחים סוקולנטים, טחבים או צמחים שאוהבים לחות. הימנעו מצמחים שדורשים שמש ישירה או מקום מאוורר מדי.",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747824379/sphog/7_d1gf6g.jpg",
                        alt: "בחירת צמחים לטרריום",
                    },
                },
            ],
        },
        bannerImage: {
            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/2_kqpsha.png",
            alt: "תמונת בית",
        },
        header: {
            title: "הבית שלך מתחיל כאן",
            description: "מגוון סדנאות, טיפים ומוצרים לעיצוב הבית והגינה",
        },
        testimonials: {
            title: "לקוחות ממליצים",
            items: [
                {
                    name: "רוני אבירם",
                    quote: "האתר שלכם כל כך מזמין ונעים, ישר גורם לרצות להירשם לסדנה. אני לא זוכרת מתי בפעם האחרונה נתקלתי באתר כל כך מושקע, עם עיצוב שמרגיש אישי ומחבק. זה פשוט נותן תחושה של בית, וזה בדיוק מה שחיפשתי. תודה רבה לכם על ההשקעה והאכפתיות!",
                    role: "מבקרת באתר",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379390/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.07_xlauuw.jpg",
                        alt: "תמונה של רוני אבירם",
                    },
                },
                {
                    name: "דניאל כהן",
                    quote: "אהבתי את הסדר והעיצוב. מרגיש מושקע ונגיש. כל פרט באתר הזה נראה כאילו הושקעה בו מחשבה רבה, וזה פשוט מדהים. אני חושב שזה אחד האתרים הכי טובים שראיתי מבחינת חוויית משתמש. כל כך קל למצוא את מה שאני מחפש, וזה פשוט תענוג. תודה על החוויה הנהדרת!",
                    role: "מעצב אתרים",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379389/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.48.48_hajf4e.jpg",
                        alt: "תמונה של דניאל כהן",
                    },
                },
                {
                    name: "אנה טולדנו",
                    quote: "ברגע שנכנסתי הבנתי שזה המקום הנכון לי. אהבתי את האנרגיה! האתר הזה פשוט מדהים, ואני לא יכולה להפסיק להתרשם מהעיצוב ומהתוכן. זה מרגיש כאילו כל פרט כאן נוצר במיוחד בשבילי. אני כל כך שמחה שמצאתי אתכם, ואני בטוחה שאחזור שוב ושוב. תודה על הכל!",
                    role: "מבקרת ראשונה",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379391/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.25_exulqi.jpg",
                        alt: "תמונה של אנה טולדנו",
                    },
                },
            ],
        },
    }

    return data
}

export default getHomeData