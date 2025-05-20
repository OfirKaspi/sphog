const LeaveDetailsFormSuccessMessage = () => {
	const { header, desc } = {
		header: "הפרטים התקבלו בהצלחה!",
		desc: "תודה על הפנייה 🙌 אחד מאנשי הצוות שלנו יצור איתך קשר תוך 24 שעות.",
	}

	return (
		<div className="text-center py-12">
			<header>
				<h3 className="text-green-700 text-2xl">
					{header}
				</h3>
				<p className="text-gray-700 text-lg">
					{desc}
				</p>
			</header>
		</div>
	)
}

export default LeaveDetailsFormSuccessMessage