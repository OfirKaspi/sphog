"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LeaveDetailsFormSuccessMessage from "@/components/forms/leave-details-form/LeaveDetailsFormSuccessMessage";
import useScrollToCenter from "@/hooks/useScrollToCenter";
import { useAppToast } from "@/hooks/useAppToast";
import { normalizeIsraeliPhone } from "@/lib/phone";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface LeaveDetailsFormProps {
  isSuccess: boolean;
  setIsSuccess: (value: boolean) => void;
}

const LeaveDetailsForm = ({ isSuccess, setIsSuccess }: LeaveDetailsFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    topic: "",
    details: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);

  const toast = useAppToast();

  useScrollToCenter(isSuccess, successMessageRef);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = "נדרש שם מלא";
    if (!normalizeIsraeliPhone(formData.phoneNumber))
      newErrors.phoneNumber = "אנא מלא מספר טלפון תקין";
    if (!formData.topic) newErrors.topic = "אנא בחר נושא";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    const normalizedPhoneNumber = normalizeIsraeliPhone(formData.phoneNumber);
    if (!normalizedPhoneNumber) return;

    setLoading(true);
    setResponseError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, phoneNumber: normalizedPhoneNumber }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result?.message || "Unknown error");

      setIsSuccess(true);
      setFormData({
        fullName: "",
        phoneNumber: "",
        topic: "",
        details: "",
      });
      toast.success("הטופס נשלח בהצלחה!");
    } catch (error) {
      console.error(error);
      setResponseError("אופס, משהו קרה. אנא נסה שנית.");
      toast.error("אופס, משהו קרה. אנא נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div ref={successMessageRef}>
        <LeaveDetailsFormSuccessMessage />
      </div>
    );
  }

  return (
    <form className="grid gap-4 py-4 text-base md:text-lg" onSubmit={handleSubmit}>

      <div className="grid grid-cols-4 items-center gap-2">
        <Label htmlFor="fullName" className="text-base md:text-lg">שם מלא</Label>
        <Input
          id="fullName"
          placeholder="ישראל ישראלי"
          className="col-span-3 bg-slate-100 text-base md:text-lg"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
        {errors.fullName && (
          <p className="col-span-4 text-red-600 text-base">{errors.fullName}</p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-2">
        <Label htmlFor="phoneNumber" className="text-base md:text-lg">טלפון</Label>
        <Input
          id="phoneNumber"
          type="text"
          placeholder="********05"
          className="col-span-3 bg-slate-100 text-base md:text-lg"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />
        {errors.phoneNumber && (
          <p className="col-span-4 text-red-600 text-base">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-2">
        <Label htmlFor="topic" className="text-base md:text-lg">נושא</Label>
        <Select
          dir="rtl"
          value={formData.topic}
          onValueChange={(value) => setFormData({ ...formData, topic: value })}
        >
          <SelectTrigger className="col-span-3 text-right bg-slate-100 text-base md:text-lg">
            <SelectValue placeholder="בחר נושא" />
          </SelectTrigger>
          <SelectContent className="text-right text-base md:text-lg">
            <SelectItem value="סדנא פרטית">סדנא פרטית</SelectItem>
            <SelectItem value="הצטרפות לסדנא קבוצתית">הצטרפות לסדנא קבוצתית</SelectItem>
            <SelectItem value="קניית טרריום">קניית טרריום</SelectItem>
            <SelectItem value="אחר">אחר</SelectItem>
          </SelectContent>
        </Select>
        {errors.topic && (
          <p className="col-span-4 text-red-600 text-base">{errors.topic}</p>
        )}
      </div>

      <div className="grid grid-cols-4 items-start gap-2">
        <Label htmlFor="details" className="self-center text-base md:text-lg">מה תרצו לדעת</Label>
        <Textarea
          id="details"
          placeholder="מה תרצו לדעת (אופציונלי)"
          className="col-span-3 bg-slate-100 text-base md:text-lg"
          value={formData.details}
          onChange={(e) =>
            setFormData({ ...formData, details: e.target.value })
          }
        />
      </div>


      {responseError &&
        <p className="text-red-600 font-bold">{responseError}</p>
      }

      <Button type="submit" className="w-full bg-cta hover:bg-cta-foreground text-base md:text-lg font-bold" disabled={loading}>
        {loading ? "שולח..." : "שלח"}
      </Button>
    </form>
  );
};

export default LeaveDetailsForm;