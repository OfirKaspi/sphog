const getPrivateWorkshopData = () => {
    const data = {
        header: {
            title: "סדנאות פרטיות",
            description: "מגוון סדנאות פרטיות מותאמות אישית"
        },
        testimonials: {
            title: "סדנאות פרטיות",
            items: [
                {
                    name: "איילת שחר",
                    quote: "חוויה אינטימית, מושקעת ויצירתית. פשוט מרגש!",
                    role: "משתתפת בסדנה זוגית",
                    avatar: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379391/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.25_exulqi.jpg",
                        alt: "איילת שחר",
                    },
                },
                {
                    name: "אורן ברוך",
                    quote: "הזמנתי את בת הזוג שלי לסדנה והיה מושלם. תודה!",
                    role: "בן זוג מופתע",
                    avatar: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379389/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.48.48_hajf4e.jpg",
                        alt: "אורן ברוך",
                    },
                },
                {
                    name: "מיטל דהן",
                    quote: "פעם ראשונה שאני באמת מתנתקת מהשגרה. הסדנה הזו עשתה לי טוב בלב.",
                    role: "משתתפת בסדנת בוקר",
                    avatar: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379392/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.49_zblyoi.jpg",
                        alt: "מיטל דהן",
                    },
                },
            ],
        },
    }

    return data
}

export default getPrivateWorkshopData