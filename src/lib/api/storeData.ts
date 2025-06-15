const getStoreData = () => {
    const data = {
        header: {
            title: "החנות שלנו",
            paragraphs: [
                "כל טרריום שלנו הוא one of a kind, פסל בוטני שעוצב ונבנה בהשראת הדמיון והתשוקה לטבע.",
                "הטרריום הסגור שלנו יוצר אקו-סיסטם מיניאטורי שמחדש את עצמו ומצריך תחזוקה מינימאלית בלבד.",
                "בכל שנה משתחררת למכירה סדרה חדשה של טרריומים שנבנו בשנה הקודמת ועברו הסתגלות ארוכה כדי לוודא שהם מותאמים ומאוזנים ויוכלו להמשיך ולשגשג עוד שנים.",
                "איזה טרריום מתאים לך?",
            ]
        },
        products: [
            // {
            //     _id: 1,
            //     name: "טרריום קטן עם אזוב יער",
            //     price: 159.90,
            //     isInStock: true,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761406/sphog/small-jar-with-piece-forest-moss_pnrwfj.jpg",
            //         alt: "טרריום קטן ומעוצב עם אזוב יער טבעי"
            //     },
            //     description: "טרריום קטן ומעוצב עם אזוב יער טבעי"
            // },
            // {
            //     _id: 2,
            //     name: "אגרטל זכוכית עם צמחים",
            //     price: 124.90,
            //     isInStock: false,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761471/sphog/glass-vase-with-rocks-plants-white-clear-surface-png-transparent-background_dc7dqm.jpg",
            //         alt: "אגרטל זכוכית מעוצב עם צמחים טבעיים"
            //     },
            //     description: "אגרטל זכוכית מעוצב עם צמחים טבעיים"
            // },
            // {
            //     _id: 3,
            //     name: "טרריום זכוכית קטן עם פקק",
            //     price: 239.90,
            //     isInStock: true,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761469/sphog/small-terrarium-glass-jar-with-cork-top_pz3j3b.jpg",
            //         alt: "טרריום זכוכית קטן עם פקק עץ"
            //     },
            //     description: "טרריום זכוכית קטן עם פקק עץ"
            // },
            // {
            //     _id: 4,
            //     name: "בקבוק יער דקורטיבי",
            //     price: 119.90,
            //     isInStock: false,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761468/sphog/small-decoration-plants-glass-bottlegarden-terrarium-bottle-forest-jar_czje55.jpg",
            //         alt: "בקבוק יער דקורטיבי עם צמחים טבעיים"
            //     },
            //     description: "בקבוק יער דקורטיבי עם צמחים טבעיים"
            // },
            // {
            //     _id: 5,
            //     name: "טרריום גולגולת פרחוני",
            //     price: 89.90,
            //     isInStock: true,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761411/sphog/unique-floral-skull-terrarium-with-exotic-plants-macabre-decorative-arrangement-concept-macabre-decor-floral-skull-terrarium-design-exotic-plants-unique-arrangement_go7tn9.jpg",
            //         alt: "טרריום ייחודי בצורת גולגולת עם צמחים אקזוטיים"
            //     },
            //     description: "טרריום ייחודי בצורת גולגולת עם צמחים אקזוטיים"
            // },
            // {
            //     _id: 6,
            //     name: "קומפוזיציית פלוריום עם סוקולנטים",
            //     price: 134.90,
            //     isInStock: false,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761411/sphog/florarium-composition-succulents-stone-sand-glass-element-interior-home-decor-glass-terarium_7_wvxqfy.jpg",
            //         alt: "פלוריום מעוצב עם סוקולנטים, אבנים וחול"
            //     },
            //     description: "פלוריום מעוצב עם סוקולנטים, אבנים וחול"
            // },
            // {
            //     _id: 7,
            //     name: "גן סוקולנטים מיניאטורי",
            //     price: 259.90,
            //     isInStock: true,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761409/sphog/mini-succulent-garden-glass-terrarium-windowsill_jxhf4k.jpg",
            //         alt: "גן סוקולנטים מיניאטורי בתוך טרריום זכוכית"
            //     },
            //     description: "גן סוקולנטים מיניאטורי בתוך טרריום זכוכית"
            // },
            // {
            //     _id: 8,
            //     name: "טרריום זכוכית מעוצב",
            //     price: 129.90,
            //     isInStock: false,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761407/sphog/charming-glass-terrarium-craft_dxwpzr.jpg",
            //         alt: "טרריום זכוכית מעוצב ומרשים"
            //     },
            //     description: "טרריום זכוכית מעוצב ומרשים"
            // },
            {
                _id: 9,
                name: "טרריום למכירה",
                price: 1000,
                isInStock: true,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749929963/sphog/2-min_1_u7ojgq.jpg",
                    alt: "תמונה של טרריום"
                },
                description: "מבחר טרריומים מעוצבים, עם סוגי טחב, פיטוניות, שרכים מגוונים, סלגינלה יהודי נודד ועוד."
            },
            // {
            //     _id: 10,
            //     name: "טרריום משושה עם תאורה",
            //     price: 89.90,
            //     isInStock: false,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761303/sphog/green-houseplant-growth-ornate-glass-terrarium-generated-by-ai_gmiqqj.jpg",
            //         alt: "טרריום משושה עם תאורה פנימית"
            //     },
            //     description: "טרריום משושה עם תאורה פנימית לצמחים"
            // },
            // {
            //     _id: 11,
            //     name: "טרריום תלוי עם צמחים",
            //     price: 159.90,
            //     isInStock: true,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761403/sphog/glass-bowl-with-succulents-plants-it_op58fh.jpg",
            //         alt: "טרריום תלוי מעוצב עם צמחים טבעיים"
            //     },
            //     description: "טרריום בצורת פירמידה עם קקטוסים ואבנים דקורטיביות"
            // },
            // {
            //     _id: 12,
            //     name: "טרריום פירמידה עם קקטוסים",
            //     price: 59.90,
            //     isInStock: true,
            //     image: {
            //         src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761403/sphog/terrarium-plant-round-glass-pot_r3rt6r.jpg",
            //         alt: "טרריום בצורת פירמידה עם קקטוסים"
            //     },
            //     description: "טרריום תלוי מעוצב עם צמחים טבעיים"
            // }
        ],
        promoHeader: {
            title: "מבצעים מיוחדים",
            // description: "מוצרים מעוצבים במחירים מיוחדים"
        },
        promoProducts: [
            {
                _id: 9,
                name: "טרריום למכירה",
                originalPrice: 1000,
                price: 850,
                isInStock: true,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1749929963/sphog/2-min_1_u7ojgq.jpg",
                    alt: "תמונה של טרריום"
                },
                description: "מבחר טרריומים מעוצבים, עם סוגי טחב, פיטוניות, שרכים מגוונים, סלגינלה יהודי נודד ועוד."
            },
        ],
        testimonials: {
            title: "לקוחות מרוצים",
            testimonials: [
                {
                    name: "עומרי",
                    quote: "מוצר מדליק מושקע מאוד. מושלם כמתנה לבית/משרד, מעניין ושונה. המוצר ארוז יפה ומגיע עם הסבר מדויק איך לשמור ולטפל בו. מאוד סייעו לי באיסוף שלו והיו מאוד שירותיים למרות שהיו בכלל בחופשה.",
                    role: "רכש מתנה לחנוכת בית",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379392/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.39_pugj7r.jpg",
                        alt: "תמונה של עומרי"
                    }
                },
                // NEED TO BE REPLACED 
                {
                    name: "גיל גרוס",
                    quote: "איכות המוצרים מדהימה, לא האמנתי עד שראיתי בעצמי. המוצרים הגיעו ארוזים בצורה מושלמת, והשירות היה אדיב ומקצועי. אני מאוד מרוצה מהקנייה שלי, ואמשיך להזמין מהחנות הזו בעתיד. אני ממליץ בחום לכל מי שמחפש מוצרים איכותיים ומעוצבים לבית ולגינה.",
                    role: "מזמין חוזר",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379389/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.48.48_hajf4e.jpg",
                        alt: "תמונה של גיל גרוס"
                    }
                },
                // NEED TO BE REPLACED 
                {
                    name: "הילה כהן",
                    quote: "המחירים מעולים והשירות פשוט נהדר. אחזור לקנות שוב. אני מאוד מרוצה מהחוויה שלי בחנות הזו, המוצרים היו בדיוק כמו שתוארו, והאיכות הייתה מעל ומעבר לציפיות שלי. אני ממליצה בחום לכל מי שמחפש מוצרים ייחודיים ומעוצבים לבית ולגינה. תודה רבה על השירות המדהים!",
                    role: "לקוחות מרוצה",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379391/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.25_exulqi.jpg",
                        alt: "תמונה של הילה כהן"
                    }
                }
            ]
        },
        openForm: {
            title: "רוצים לשמוע עוד?",
            description: "שלחו לנו כאן במה אתם מתעניינים ונחזור אליכם ממש מהר.",
        }
    }

    return data
}

export default getStoreData