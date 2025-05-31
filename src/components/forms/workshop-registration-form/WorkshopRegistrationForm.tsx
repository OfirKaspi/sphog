// components/WorkshopRegistrationForm.tsx
"use client";

import { useMemo, useState, useRef } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LeaveDetailsFormSuccessMessage from "@/components/forms/leave-details-form/LeaveDetailsFormSuccessMessage";
import useScrollToCenter from "@/hooks/useScrollToCenter";

export interface AvailableDate {
  date: Date;
  hours: string[];
}

interface WorkshopRegistrationFormProps {
  availableDates: AvailableDate[];
  isSuccess: boolean;
  setIsSuccess: (value: boolean) => void;
}

export default function WorkshopRegistrationForm({
  availableDates,
  isSuccess,
  setIsSuccess,
}: WorkshopRegistrationFormProps) {
  const successMessageRef = useRef<HTMLDivElement>(null);

  useScrollToCenter(isSuccess, successMessageRef);

  const [formData, setFormData] = useState<{
    selectedDate: Date | undefined;
    selectedHour: string | null;
    fullName: string;
    phoneNumber: string;
  }>({
    selectedDate: undefined,
    selectedHour: null,
    fullName: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  const dateMap = useMemo(() => {
    const map = new Map<string, AvailableDate>();
    availableDates.forEach((d) => map.set(format(d.date, "yyyy-MM-dd"), d));
    return map;
  }, [availableDates]);

  const hoursForSelectedDate = formData.selectedDate
    ? dateMap.get(format(formData.selectedDate, "yyyy-MM-dd"))?.hours || []
    : [];

  const disableUnlistedDates = (date: Date) =>
    !dateMap.has(format(date, "yyyy-MM-dd"));

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.selectedDate) newErrors.selectedDate = "אנא בחר תאריך";
    if (!formData.selectedHour) newErrors.selectedHour = "אנא בחר שעה";
    if (!formData.fullName.trim()) newErrors.fullName = "נדרש שם מלא";
    if (!formData.phoneNumber.match(/^05\d{8}$/))
      newErrors.phoneNumber = "אנא מלא מספר טלפון תקין";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setResponseError(null);

    try {
      const response = await fetch("/api/workshop-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedDate: formData.selectedDate?.toISOString().split("T")[0],
          selectedHour: formData.selectedHour,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result?.message || "Unknown error");

      setIsSuccess(true);
      setFormData({
        selectedDate: undefined,
        selectedHour: null,
        fullName: "",
        phoneNumber: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
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
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 py-4 text-base md:text-lg"
    >
      {responseError && (
        <p className="text-red-600 text-base">{responseError}</p>
      )}

      <div className="grid gap-2">
        <Label htmlFor="calendar" className="text-base md:text-lg">
          בחר תאריך
        </Label>
        <Calendar
          mode="single"
          selected={formData.selectedDate}
          onSelect={(date) =>
            setFormData({ ...formData, selectedDate: date, selectedHour: null })
          }
          disabled={disableUnlistedDates}
        />
        {errors.selectedDate && (
          <p className="text-red-600 text-base">{errors.selectedDate}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="selectedHour" className="text-base md:text-lg">
          בחר שעה
        </Label>
        <Select
          dir="rtl"
          disabled={hoursForSelectedDate.length === 0}
          value={formData.selectedHour || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, selectedHour: value })
          }
        >
          <SelectTrigger
            className="w-full">
            <SelectValue placeholder="זמן פנוי" />
          </SelectTrigger>
          <SelectContent>
            {hoursForSelectedDate.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.selectedHour && (
          <p className="text-red-600 text-base">{errors.selectedHour}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="fullName" className="text-base md:text-lg">
          שם מלא
        </Label>
        <Input
          id="fullName"
          placeholder="ישראל ישראלי"
          className="w-full text-base md:text-lg"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
        {errors.fullName && (
          <p className="text-red-600 text-base">{errors.fullName}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phoneNumber" className="text-base md:text-lg">
          טלפון
        </Label>
        <Input
          id="phoneNumber"
          type="text"
          placeholder="********05"
          className="w-full  text-base md:text-lg"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />
        {errors.phoneNumber && (
          <p className="text-red-600 text-base">{errors.phoneNumber}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-cta hover:bg-cta-foreground text-base md:text-lg"
        disabled={loading || !formData.selectedDate || !formData.selectedHour}
      >
        {loading ? "שולח..." : "שלח"}
      </Button>
    </form>
  );
}
