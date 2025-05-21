const getPublicWorkshopData = () => {
    const data = {
        header: {
            title: "סדנאות לקבוצות גדולות",
            description: "מגוון סדנאות לקבוצות גדולות, סדנאות לקבוצות גדולות, סדנאות לקבוצות גדולות",
        },
        testimonials: {
            title: "סדנאות לקהל הרחב",
            items: [
                {
                    name: "רונית ברנס",
                    quote: "האנרגיה במקום הייתה מדהימה, וגם למדתי המון על טרריום.",
                    role: "משתתפת",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379392/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.39_pugj7r.jpg",
                        alt: "רונית ברנס",
                    },
                },
                {
                    name: "אלעד כהן",
                    quote: "הגעתי לבד ויצאתי עם חברים חדשים וחוויה מיוחדת.",
                    role: "סטודנט",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379389/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.48.48_hajf4e.jpg",
                        alt: "אלעד כהן",
                    },
                },
                {
                    name: "שלי פרידמן",
                    quote: "כל כך נהניתי, חוויה שמשאירה טעם של עוד!",
                    role: "משתתפת בסדנה פתוחה",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379391/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.25_exulqi.jpg",
                        alt: "שלי פרידמן",
                    },
                },
            ],
        },
    }

    return data
}

export default getPublicWorkshopData