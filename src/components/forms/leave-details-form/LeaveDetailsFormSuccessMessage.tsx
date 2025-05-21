const LeaveDetailsFormSuccessMessage = () => {
	const { header, desc } = {
		header: "הפרטים התקבלו בהצלחה!",
		desc: "תודה על הפנייה 🙌 אחד מאנשי הצוות שלנו יצור איתך קשר תוך 24 שעות.",
	}

	return (
		<div className="text-center py-12">
			<header className="space-y-2">
				<h3 className="text-primary text-3xl md:text-4xl">
					{header}
				</h3>
				<p className="text-slate-900 md:text-lg">
					{desc}
				</p>
			</header>
		</div>
	)
}

export default LeaveDetailsFormSuccessMessage