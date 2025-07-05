"use client";

import { useMemo, useState, useRef } from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { useAppToast } from "@/hooks/useAppToast";
import { Calendar } from "@/components/ui/calendar";
import { WorkshopType } from "@/types/types";
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
import Legend from "./Legend";

// Define the interface for available dates
export interface AvailableDate {
  date: Date;
  hours: string[];
  workshop: WorkshopType;
}

// Define the props for the WorkshopRegistrationForm component
interface WorkshopRegistrationFormProps {
  availableDates: AvailableDate[];
  isSuccess: boolean;
  setIsSuccess: (value: boolean) => void;
}

// Main component for workshop registration form
export default function WorkshopRegistrationForm({
  availableDates,
  isSuccess,
  setIsSuccess,
}: WorkshopRegistrationFormProps) {
  const successMessageRef = useRef<HTMLDivElement>(null);

  // Scroll to center when form submission is successful
  useScrollToCenter(isSuccess, successMessageRef);

  // State for form data
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

  // State for form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  // Filter out past dates
  const filteredDates = useMemo(() => {
    const today = startOfDay(new Date());
    return availableDates.filter((d) => !isBefore(startOfDay(d.date), today));
  }, [availableDates]);

  // Map dates to workshop information
  const dateMap = useMemo(() => {
    const map = new Map<string, { workshop: string }>();
    filteredDates.forEach((d) =>
      map.set(format(d.date, "yyyy-MM-dd"), { workshop: d.workshop })
    );
    return map;
  }, [filteredDates]);

  const toast = useAppToast();

  // Get available hours for the selected date
  const hoursForSelectedDate = useMemo(() => {
    if (!formData.selectedDate) return [];
    
    const selectedDateStr = format(formData.selectedDate, "yyyy-MM-dd");
    const selectedDateData = filteredDates.find(
      (d) => format(d.date, "yyyy-MM-dd") === selectedDateStr
    );
    
    // If the workshop is unavailable or not found, return empty array
    if (!selectedDateData || selectedDateData.workshop === WorkshopType.UNAVAILABLE) {
      return [];
    }
    
    // Otherwise return the available hours
    return selectedDateData.hours;
  }, [formData.selectedDate, filteredDates]);

  // Handle day click with special handling for unavailable dates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDayClick = (date: Date, modifiers: any) => {
    if (modifiers.unavailable) {
      // Show toast but don't select the date
      toast.info("מצטערים, לא נשארו מקומות פנויים בסדנא.");
      return;
    }

    // Check if this date has an unavailable workshop type
    const dateKey = format(date, "yyyy-MM-dd");
    const workshopType = dateMap.get(dateKey)?.workshop;

    if (workshopType === WorkshopType.UNAVAILABLE) {
      // Show toast but don't select the date
      toast.info("מצטערים, לא נשארו מקומות פנויים בסדנא.");
      return;
    }

    // For available dates, update the selection
    setFormData({
      ...formData,
      selectedDate: date,
      selectedHour: null,
    });
  };

  // Create a special disabled function to handle dates with workshop: unavailable
  const disableUnlistedDates = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const workshopInfo = dateMap.get(dateKey);

    if (!workshopInfo) {
      // Date not in our list at all
      return true;
    }

    // Don't disable dates with workshop: unavailable so they can receive clicks
    // But they won't actually be selectable due to our handleDayClick logic
    return false;
  };

  // Validate form data
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.selectedDate) newErrors.selectedDate = "אנא בחר תאריך";
    if (!formData.selectedHour) newErrors.selectedHour = "אנא בחר שעה";
    if (!formData.fullName.trim()) newErrors.fullName = "נדרש שם מלא";
    if (!formData.phoneNumber.match(/^05\d{8}$/))
      newErrors.phoneNumber = "אנא מלא מספר טלפון תקין";
    return newErrors;
  };

  // Handle form submission
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
      toast.success("הטופס נשלח בהצלחה!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseError("אופס, משהו קרה. אנא נסה שנית.");
      toast.error("אופס, משהו קרה. אנא נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  // Render success message if form submission is successful
  if (isSuccess) {
    return (
      <div ref={successMessageRef}>
        <LeaveDetailsFormSuccessMessage />
      </div>
    );
  }

  // Render the form
  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 py-4 text-base md:text-lg"
    >
      <div className="grid gap-2">
        <Legend />
        <Label htmlFor="calendar" className="text-base md:text-lg">
          תאריך
        </Label>
        <Calendar
          mode="single"
          selected={formData.selectedDate}
          disabled={disableUnlistedDates}
          dateMap={dateMap}
          onDayClick={handleDayClick}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="selectedHour" className="text-base md:text-lg">
          שעה
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
            className="w-full md:text-lg"
            aria-label="בחר שעה"
          >
            <SelectValue placeholder="זמן פעילות" />
          </SelectTrigger>
          <SelectContent className="md:text-lg">
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

      {responseError && (
        <p className="text-red-600 font-bold">{responseError}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-cta hover:bg-cta-foreground text-base md:text-lg font-bold"
        disabled={loading || !formData.selectedDate || !formData.selectedHour}
      >
        {loading ? "שולח..." : "שלח"}
      </Button>
    </form>
  );
}
