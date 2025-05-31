const getPrivateWorkshopData = () => {
    const data = {
        header: {
            title: "סדנאות פרטיות",
            description: "מגוון סדנאות פרטיות מותאמות אישית"
        },
        workshopFormData: {
            header: {
                title: "סדנה פרטית",
                description: "בחר תאריך ושעה לסדנה פרטית מותאמת אישית.",
            },
            availableDates: [
                { date: new Date("2025-06-12"), hours: ["10:00-11:00", "14:00-15:00"] },
                { date: new Date("2025-06-13"), hours: ["09:00-10:00", "13:00-14:00"] },
                { date: new Date("2025-06-14"), hours: ["11:00-12:00", "15:00-16:00"] },
            ],
        },
        testimonials: {
            title: "לקוחות ממליצים",
            testimonials: [
                {
                    name: "איילת שחר",
                    quote: "חוויה אינטימית, מושקעת ויצירתית. פשוט מרגש! חוויה אינטימית, מושקעת ויצירתית. פשוט מרגש! חוויה אינטימית, מושקעת ויצירתית. פשוט מרגש! חוויה אינטימית, מושקעת ויצירתית. פשוט מרגש!",
                    role: "משתתפת בסדנה זוגית",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747934925/sphog/pngimg.com_-_calvin_klein_PNG19_wq3nnx.png",
                        alt: "איילת שחר",
                    },
                },
                {
                    name: "אורן ברוך",
                    quote: "הזמנתי את בת הזוג שלי לסדנה והיה מושלם. תודה! הזמנתי את בת הזוג שלי לסדנה והיה מושלם. תודה! הזמנתי את בת הזוג שלי לסדנה והיה מושלם. תודה! הזמנתי את בת הזוג שלי לסדנה והיה מושלם. תודה!",
                    role: "בן זוג מופתע",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747934396/sphog/coco-cola_z07zef.avif",
                        alt: "אורן ברוך",
                    },
                },
                {
                    name: "מיטל דהן",
                    quote: "פעם ראשונה שאני באמת מתנתקת מהשגרה. הסדנה הזו עשתה לי טוב בלב. פעם ראשונה שאני באמת מתנתקת מהשגרה. הסדנה הזו עשתה לי טוב בלב. פעם ראשונה שאני באמת מתנתקת מהשגרה. הסדנה הזו עשתה לי טוב בלב. פעם ראשונה שאני באמת מתנתקת מהשגרה. הסדנה הזו עשתה לי טוב בלב.",
                    role: "משתתפת בסדנת בוקר",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747935364/sphog/download_kmg8nz.jpg",
                        alt: "מיטל דהן",
                    },
                },
            ],
        },
    }

    return data
}

export default getPrivateWorkshopData