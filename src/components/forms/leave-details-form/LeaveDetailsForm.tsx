"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LeaveDetailsFormSuccessMessage from "@/components/forms/leave-details-form/LeaveDetailsFormSuccessMessage";

interface LeaveDetailsFormProps {
  isSuccess: boolean;
  setIsSuccess: (value: boolean) => void;
}

const LeaveDetailsForm = ({ isSuccess, setIsSuccess }: LeaveDetailsFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    requestedService: "",
    additionalDetails: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = "נדרש שם מלא";
    if (!formData.phoneNumber.match(/^05\d{8}$/))
      newErrors.phoneNumber = "אנא מלא מספר טלפון תקין";
    if (!formData.requestedService)
      newErrors.requestedService = "אנא בחר סוג סדנה";

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
        requestedService: "",
        additionalDetails: "",
      });
    } catch (error) {
      console.error(error);
      setResponseError("אופס, משהו קרה. אנא נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return <LeaveDetailsFormSuccessMessage />;
  }

  return (
    <form className="grid gap-4 py-4 text-sm sm:text-base md:text-lg" onSubmit={handleSubmit}>
      {responseError && <p className="text-red-600 text-sm sm:text-base">{responseError}</p>}

      <div className="grid grid-cols-4 items-center gap-2">
        <Label htmlFor="fullName" className="text-sm sm:text-base md:text-lg">שם מלא</Label>
        <Input
          id="fullName"
          placeholder="ישראל ישראלי"
          className="col-span-3 bg-slate-100 text-sm sm:text-base md:text-lg"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
        {errors.fullName && (
          <p className="col-span-4 text-red-600 text-sm sm:text-base">{errors.fullName}</p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-2">
        <Label htmlFor="phoneNumber" className="text-sm sm:text-base md:text-lg">טלפון</Label>
        <Input
          id="phoneNumber"
          type="text"
          placeholder="********05"
          className="col-span-3 bg-slate-100 text-sm sm:text-base md:text-lg"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />
        {errors.phoneNumber && (
          <p className="col-span-4 text-red-600 text-sm sm:text-base">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-2">
        <Label htmlFor="requestedService" className="text-sm sm:text-base md:text-lg">סוג סדנה</Label>
        <select
          id="requestedService"
          className="col-span-3 bg-slate-100 border rounded px-3 py-2 text-sm sm:text-base md:text-lg"
          value={formData.requestedService}
          onChange={(e) =>
            setFormData({ ...formData, requestedService: e.target.value })
          }
        >
          <option value="" disabled>
            בחר סוג סדנה
          </option>
          <option value="privateWorkshop">סדנה פרטית</option>
          <option value="publicWorkshop">סדנה ציבורית</option>
        </select>
        {errors.requestedService && (
          <p className="col-span-4 text-red-600 text-sm sm:text-base">{errors.requestedService}</p>
        )}
      </div>

      <div className="grid grid-cols-4 items-start gap-2">
        <Label htmlFor="additionalDetails" className="self-center text-sm sm:text-base md:text-lg">פרטים נוספים</Label>
        <Textarea
          id="additionalDetails"
          placeholder="פרטים נוספים (אופציונלי)"
          className="col-span-3 bg-slate-100 text-sm sm:text-base md:text-lg"
          value={formData.additionalDetails}
          onChange={(e) =>
            setFormData({ ...formData, additionalDetails: e.target.value })
          }
        />
      </div>

      <Button type="submit" className="w-full bg-cta hover:bg-cta-foreground text-sm sm:text-base md:text-lg" disabled={loading}>
        {loading ? "שולח..." : "שלח"}
      </Button>
    </form>
  );
};

export default LeaveDetailsForm;