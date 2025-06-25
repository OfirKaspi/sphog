export default function Head() {
	return (
		<>
			{/* Title + Meta Description */}
			<title>סדנת טרריום ייחודית – חוויה ירוקה, עיצובית ויצירתית | SPHOG</title>
			<meta
				name="description"
				content="זמן איכות זוגי, צוותי או עם חברים בסטודיו קסום בתל אביב. תעצבו טרריום אישי ומרהיב - ותיקחו הביתה מזכרת יפה שממשיכה לצמוח ולהתפתח."
			/>
			<meta
				name="keywords"
				content="טרריום, סדנת טרריום, סדנאת טרריום, סדנאות טרריום, הכנת טרריום, יצירת טרריום, סדנת טרריום בתל אביב, סדנאת טרריום בתל אביב, סדנאות טרריום בתל אביב, טרריום להכנה בבית, טרריום להכנה עצמית, איך להכין טרריום, סדנת טרריום במרכז, סדנאת טרריום במרכז, סדנאות טרריום במרכז, עיצוב טרריום, טרריום מעוצב, טיפים להכנת טרריום, טיפים לתחזוקת טרריום, איך לשמור על הטרריום שלי, סדנת טרריום לצוות, סדנת טרריום זוגית, סדנת טרריום פרטית, רכישת טרריום, קניית טרריום, טרריום לרכישה, מתנה טרריום, טרריום במתנה, שובר מתנה טרריום"
			/>

			{/* Open Graph */}
			<meta property="og:title" content="סדנת טרריום ייחודית – חוויה ירוקה, עיצובית ויצירתית | SPHOG" />
			<meta
				property="og:description"
				content="זמן איכות זוגי, צוותי או עם חברים בסטודיו קסום בתל אביב. תעצבו טרריום אישי ומרהיב - ותיקחו הביתה מזכרת יפה שממשיכה לצמוח ולהתפתח."
			/>
			<meta property="og:url" content="https://sphogmoss.com" />
			<meta property="og:site_name" content="Sphog" />
			<meta property="og:locale" content="he_IL" />
			<meta property="og:type" content="website" />
			<meta
				property="og:image"
				content="https://res.cloudinary.com/dudwjf2pu/image/upload/v1750500843/sphog/og_image_y1cltf.jpg"
			/>

			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content="סדנת טרריום ייחודית – חוויה ירוקה, עיצובית ויצירתית | SPHOG" />
			<meta
				name="twitter:description"
				content="זמן איכות זוגי, צוותי או עם חברים בסטודיו קסום בתל אביב. תעצבו טרריום אישי ומרהיב - ותיקחו הביתה מזכרת יפה שממשיכה לצמוח ולהתפתח."
			/>
			<meta
				name="twitter:image"
				content="https://res.cloudinary.com/dudwjf2pu/image/upload/v1750500843/sphog/og_image_y1cltf.jpg"
			/>

			{/* Icons */}
			<link rel="icon" href="/favicon.ico" type="image/x-icon" />
			<link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />
			<link rel="apple-touch-icon" href="/logo.png" />


			{/* JSON-LD Structured Data */}
			<script type="application/ld+json">
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Organization",
					name: "Sphogmoss",
					url: "https://sphogmoss.com",
					logo: "https://sphogmoss.com/logo.png",
				})}
			</script>
			<script type="application/ld+json">
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "WebSite",
					name: "Sphogmoss",
					url: "https://sphogmoss.com",
					description:
						"זמן איכות זוגי, צוותי או עם חברים בסטודיו קסום בתל אביב. תעצבו טרריום אישי ומרהיב - ותיקחו הביתה מזכרת יפה שממשיכה לצמוח ולהתפתח.",
					image:
						"https://res.cloudinary.com/dudwjf2pu/image/upload/v1750500843/sphog/og_image_y1cltf.jpg",
				})}
			</script>
		</>
	);
}
