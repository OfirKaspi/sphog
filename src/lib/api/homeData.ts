const getHomeData = () => {
    const data = {
        bannerImage: {
            src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747765974/sphog/2_kqpsha.png",
            alt: "תמונת בית",
        },
        header: {
            title: "הבית שלך מתחיל כאן",
            description: "מגוון סדנאות, טיפים ומוצרים לעיצוב הבית והגינה",
        },
        testimonials: {
            title: "עמוד הבית",
            items: [
                {
                    name: "רוני אבירם",
                    quote: "האתר שלכם כל כך מזמין ונעים, ישר גורם לרצות להירשם לסדנה.",
                    role: "מבקרת באתר",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379390/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.07_xlauuw.jpg",
                        alt: "תמונה של רוני אבירם",
                    },
                },
                {
                    name: "דניאל כהן",
                    quote: "אהבתי את הסדר והעיצוב. מרגיש מושקע ונגיש.",
                    role: "מעצב אתרים",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379389/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.48.48_hajf4e.jpg",
                        alt: "תמונה של דניאל כהן",
                    },
                },
                {
                    name: "אנה טולדנו",
                    quote: "ברגע שנכנסתי הבנתי שזה המקום הנכון לי. אהבתי את האנרגיה!",
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