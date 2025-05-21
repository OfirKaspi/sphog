const getTipsData = () => {
    const data = {
        header: {
            title: "טיפים",
            description: "מגוון טיפים לעיצוב הבית והגינה",
        },
        testimonials: {
            title: "טיפים וידע מקצועי",
            items: [
              {
                name: "גדי הרשקוביץ",
                quote: "למדתי סוף סוף איך לטפל בעציץ כמו שצריך, תודה על ההסבר הברור!",
                role: "חובב גינון",
                image: {
                  src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379389/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.48.48_hajf4e.jpg",
                  alt: "תמונה של גדי הרשקוביץ",
                },
              },
              {
                name: "שני לוי",
                quote: "הטיפים באתר פשוט הצילו לי את הטרריום מהתייבשות.",
                role: "משתמשת ותיקה",
                image: {
                  src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379391/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.25_exulqi.jpg",
                  alt: "תמונה של שני לוי",
                },
              },
              {
                name: "אבי דיין",
                quote: "ניכר שמדובר באנשים מקצוענים. כל עצה הייתה בול.",
                role: "משתמש באתר",
                image: {
                  src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1734379390/Let%27s%20Garden/WhatsApp_Image_2024-12-16_at_21.49.07_xlauuw.jpg",
                  alt: "תמונה של אבי דיין",
                },
              },
            ],
          },
    }

    return data
}

export default getTipsData