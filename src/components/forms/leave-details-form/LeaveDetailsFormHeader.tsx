import { DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface LeaveDetailsFormDialogHeaderProps {
	isSuccess: boolean
}

const LeaveDetailsFormDialogHeader = ({ isSuccess }: LeaveDetailsFormDialogHeaderProps) => {
	const { header, desc } = {
		header: "נעים להכיר!",
		desc: "השאירו פרטים לשיחת ייעוץ בחינם - תספרו לנו מה העסק שלכם צריך ותקבלו טיפים שתוכלו ליישם מיד",
	}

	return (
		<DialogHeader className="relative">
			{isSuccess ? (
				<VisuallyHidden>
					<DialogTitle>{header}</DialogTitle>
					<DialogDescription>{desc}</DialogDescription>
				</VisuallyHidden>
			) : (
				<>
					<DialogTitle className="text-center">{header}</DialogTitle>
					<DialogDescription className="text-center">{desc}</DialogDescription>
				</>
			)}
		</DialogHeader>
	)
}

export default LeaveDetailsFormDialogHeader
