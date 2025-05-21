const getStoreData = () => {
    const data = {
        header: {
            title: "חנות",
            description: "מגוון מוצרים מעוצבים לבית ולגינה"
        },
        products: [
            {
                _id: 1,
                name: "טרריום קטן עם אזוב יער",
                price: 159.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761406/sphog/small-jar-with-piece-forest-moss_pnrwfj.jpg",
                    alt: "טרריום קטן ומעוצב עם אזוב יער טבעי"
                },
                description: "טרריום קטן ומעוצב עם אזוב יער טבעי"
            },
            {
                _id: 2,
                name: "אגרטל זכוכית עם צמחים",
                price: 124.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761471/sphog/glass-vase-with-rocks-plants-white-clear-surface-png-transparent-background_dc7dqm.jpg",
                    alt: "אגרטל זכוכית מעוצב עם צמחים טבעיים"
                },
                description: "אגרטל זכוכית מעוצב עם צמחים טבעיים"
            },
            {
                _id: 3,
                name: "טרריום זכוכית קטן עם פקק",
                price: 239.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761469/sphog/small-terrarium-glass-jar-with-cork-top_pz3j3b.jpg",
                    alt: "טרריום זכוכית קטן עם פקק עץ"
                },
                description: "טרריום זכוכית קטן עם פקק עץ"
            },
            {
                _id: 4,
                name: "בקבוק יער דקורטיבי",
                price: 119.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761468/sphog/small-decoration-plants-glass-bottlegarden-terrarium-bottle-forest-jar_czje55.jpg",
                    alt: "בקבוק יער דקורטיבי עם צמחים טבעיים"
                },
                description: "בקבוק יער דקורטיבי עם צמחים טבעיים"
            },
            {
                _id: 5,
                name: "טרריום גולגולת פרחוני",
                price: 89.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761411/sphog/unique-floral-skull-terrarium-with-exotic-plants-macabre-decorative-arrangement-concept-macabre-decor-floral-skull-terrarium-design-exotic-plants-unique-arrangement_go7tn9.jpg",
                    alt: "טרריום ייחודי בצורת גולגולת עם צמחים אקזוטיים"
                },
                description: "טרריום ייחודי בצורת גולגולת עם צמחים אקזוטיים"
            },
            {
                _id: 6,
                name: "קומפוזיציית פלוריום עם סוקולנטים",
                price: 134.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761411/sphog/florarium-composition-succulents-stone-sand-glass-element-interior-home-decor-glass-terarium_7_wvxqfy.jpg",
                    alt: "פלוריום מעוצב עם סוקולנטים, אבנים וחול"
                },
                description: "פלוריום מעוצב עם סוקולנטים, אבנים וחול"
            },
            {
                _id: 7,
                name: "גן סוקולנטים מיניאטורי",
                price: 259.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761409/sphog/mini-succulent-garden-glass-terrarium-windowsill_jxhf4k.jpg",
                    alt: "גן סוקולנטים מיניאטורי בתוך טרריום זכוכית"
                },
                description: "גן סוקולנטים מיניאטורי בתוך טרריום זכוכית"
            },
            {
                _id: 8,
                name: "טרריום זכוכית מעוצב",
                price: 129.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761407/sphog/charming-glass-terrarium-craft_dxwpzr.jpg",
                    alt: "טרריום זכוכית מעוצב ומרשים"
                },
                description: "טרריום זכוכית מעוצב ומרשים"
            },
            {
                _id: 9,
                name: "טרריום עגול עם צמחייה",
                price: 99.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761405/sphog/terrarium-plant-round-glass_yisjbr.jpg",
                    alt: "טרריום עגול עם צמחייה טבעית"
                },
                description: "טרריום עגול עם צמחייה טבעית"
            },
            {
                _id: 10,
                name: "טרריום משושה עם תאורה",
                price: 89.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761303/sphog/green-houseplant-growth-ornate-glass-terrarium-generated-by-ai_gmiqqj.jpg",
                    alt: "טרריום משושה עם תאורה פנימית"
                },
                description: "טרריום משושה עם תאורה פנימית לצמחים"
            },
            {
                _id: 11,
                name: "טרריום תלוי עם צמחים",
                price: 159.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761403/sphog/glass-bowl-with-succulents-plants-it_op58fh.jpg",
                    alt: "טרריום תלוי מעוצב עם צמחים טבעיים"
                },
                description: "טרריום תלוי מעוצב עם צמחים טבעיים"
            },
            {
                _id: 12,
                name: "טרריום פירמידה עם קקטוסים",
                price: 59.90,
                image: {
                    src: "https://res.cloudinary.com/dudwjf2pu/image/upload/v1747761403/sphog/terrarium-plant-round-glass-pot_r3rt6r.jpg",
                    alt: "טרריום בצורת פירמידה עם קקטוסים"
                },
                description: "טרריום בצורת פירמידה עם קקטוסים ואבנים דקורטיביות"
            }
        ]
    }

    return data
}

export default getStoreData