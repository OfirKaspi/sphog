"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LeaveDetailsFormSuccessMessage from "@/components/forms/leave-details-form/LeaveDetailsFormSuccessMessage";
import useScrollToCenter from "@/hooks/useScrollToCenter";

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

  useScrollToCenter(isSuccess, successMessageRef);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = "נדרש שם מלא";
    if (!formData.phoneNumber.match(/^05\d{8}$/))
      newErrors.phoneNumber = "אנא מלא מספר טלפון תקין";
    if (!formData.topic) newErrors.topic = "אנא בחר נושא";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setResponseError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    } catch (error) {
      console.error(error);
      setResponseError("אופס, משהו קרה. אנא נסה שנית.");
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
        <select
          id="topic"
          className="col-span-3 bg-slate-100 border rounded px-3 py-2 text-base md:text-lg"
          value={formData.topic}
          onChange={(e) =>
            setFormData({ ...formData, topic: e.target.value })
          }
        >
          <option value="" disabled>
            בחר נושא
          </option>
          <option value="סדנא פרטית">סדנא פרטית</option>
          <option value="הצטרפות לסדנא קבוצתית">הצטרפות לסדנא קבוצתית</option>
          <option value="קניית טרריום">קניית טרריום</option>
          <option value="אחר">אחר</option>
        </select>
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