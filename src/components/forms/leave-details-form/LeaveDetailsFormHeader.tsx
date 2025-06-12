import { DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LeaveDetailsFormDialogHeaderProps {
  isSuccess: boolean;
}

const LeaveDetailsFormDialogHeader = ({ isSuccess }: LeaveDetailsFormDialogHeaderProps) => {
  const { header, description } = {
    header: "נעים להכיר!",
    description: "השאירו פרטים ונחזור אליכם עם כל המידע על הסדנאות שלנו, טרריומים למכירה וכל דבר נוסף שתרצו לדעת על עולם הטרריום.",
  };

  return (
    <DialogHeader className="relative">
      {isSuccess ? (
        <VisuallyHidden>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </VisuallyHidden>
      ) : (
        <>
          <DialogTitle className="text-2xl md:text-3xl text-center text-primary leading-relaxed">
            {header}
          </DialogTitle>
          <DialogDescription className="md:text-lg text-center text-slate-900">
            {description}
          </DialogDescription>
        </>
      )}
    </DialogHeader>
  );
};

export default LeaveDetailsFormDialogHeader;
