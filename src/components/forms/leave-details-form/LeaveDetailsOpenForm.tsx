"use client"

import { useState } from "react"
import LeaveDetailsForm from "@/components/forms/leave-details-form/LeaveDetailsForm"

const LeaveDetailsOpenForm = () => {
	const [isSuccess, setIsSuccess] = useState(false)

	return (
		<section className="max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-900">
			<div className="mb-6 text-center">
				<h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
					נשמח לשמוע ממך!
				</h3>
				<p className="mt-2 text-gray-600 dark:text-gray-300">
					השאר את הפרטים שלך ונחזור אליך בהקדם עם הצעה מותאמת אישית לעסק שלך 🚀
				</p>
			</div>

			<LeaveDetailsForm isSuccess={isSuccess} setIsSuccess={setIsSuccess} />
		</section>
	)
}

export default LeaveDetailsOpenForm
