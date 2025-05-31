const getPublicWorkshopData = () => {
    const data = {
        header: {
            title: "סדנאות לקבוצות גדולות",
            description: "מגוון סדנאות לקבוצות גדולות, סדנאות לקבוצות גדולות, סדנאות לקבוצות גדולות",
        },
        workshopFormData: {
            header: {
                title: "סדנה לקבוצות גדולות",
                description: "בחר תאריך ושעה לסדנה לקבוצות גדולות מותאמת אישית.",
            },
            availableDates: [
                { date: new Date("2025-06-15"), hours: ["10:00-11:00", "14:00-15:00"] },
                { date: new Date("2025-06-16"), hours: ["09:00-10:00", "13:00-14:00"] },
                { date: new Date("2025-06-17"), hours: ["11:00-12:00", "15:00-16:00"] },
            ],
        },
        testimonials: {
            title: "לקוחות ממליצים",
            testimonials: [
                {
                    name: "רונית ברנס",
                    quote: "האנרגיה במקום הייתה מדהימה, וגם למדתי המון על טרריום. האנרגיה במקום הייתה מדהימה, וגם למדתי המון על טרריום. האנרגיה במקום הייתה מדהימה, וגם למדתי המון על טרריום. האנרגיה במקום הייתה מדהימה, וגם למדתי המון על טרריום.",
                    role: "משתתפת",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379392/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.39_pugj7r.jpg",
                        alt: "רונית ברנס",
                    },
                },
                {
                    name: "אלעד כהן",
                    quote: "הגעתי לבד ויצאתי עם חברים חדשים וחוויה מיוחדת. הגעתי לבד ויצאתי עם חברים חדשים וחוויה מיוחדת. הגעתי לבד ויצאתי עם חברים חדשים וחוויה מיוחדת. הגעתי לבד ויצאתי עם חברים חדשים וחוויה מיוחדת.",
                    role: "סטודנט",
                    image: {
                        src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379389/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.48.48_hajf4e.jpg",
                        alt: "אלעד כהן",
                    },
                },
                {
                    name: "שלי פרידמן",
                    quote: "כל כך נהניתי, חוויה שמשאירה טעם של עוד! כל כך נהניתי, חוויה שמשאירה טעם של עוד! כל כך נהניתי, חוויה שמשאירה טעם של עוד! כל כך נהניתי, חוויה שמשאירה טעם של עוד!",
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