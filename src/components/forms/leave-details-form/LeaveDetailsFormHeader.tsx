import { DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LeaveDetailsFormDialogHeaderProps {
  isSuccess: boolean;
}

const LeaveDetailsFormDialogHeader = ({ isSuccess }: LeaveDetailsFormDialogHeaderProps) => {
const { header, desc } = {
	header: "נעים להכיר!",
	desc: "השאירו פרטים ונחזור אליכם עם פתרונות מותאמים אישית לסדנאות ולפעילויות יצירה של טרריומים שיעזרו לכם להעצים וליצור חוויות בלתי נשכחות.",
};

  return (
    <DialogHeader className="relative">
      {isSuccess ? (
        <VisuallyHidden>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </VisuallyHidden>
      ) : (
        <>
          <DialogTitle className="text-3xl md:text-4xl text-primary leading-relaxed">
            {header}
          </DialogTitle>
          <DialogDescription className="md:text-lg text-slate-900">
            {desc}
          </DialogDescription>
        </>
      )}
    </DialogHeader>
  );
};

export default LeaveDetailsFormDialogHeader;
