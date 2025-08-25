/* components/ui/calendar.tsx */
"use client";

import { he } from "date-fns/locale";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WorkshopType } from "@/types/types";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  dateMap?: Map<string, { workshop: string }>;
};

export function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  dateMap,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      dir="rtl"
      locale={he}
      showOutsideDays={showOutsideDays}
      className={cn("mt-2", className)}
      classNames={{
        months: "flex justify-center items-center",
        month: "space-y-4",
        caption: "flex items-center justify-between w-full",
        caption_label: "text-sm sm:text-base md:text-lg",
        nav: "flex gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full gap-1",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2 gap-1",

        cell:
          "h-9 w-9 p-0 relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal transition-colors duration-150",
          "aria-selected:border-2 aria-selected:border-primary",
        ),
        day_range_end: "day-range-end",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground pointer-events-none",
        day_disabled: "pointer-events-none",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      modifiers={{
        family: (date) => {
          const workshop = dateMap?.get(format(date, "yyyy-MM-dd"))?.workshop;
          return workshop === WorkshopType.FAMILY ||
            workshop === 'FAMILY' ||
            workshop === 'family';
        },
        advanced: (date) => {
          const workshop = dateMap?.get(format(date, "yyyy-MM-dd"))?.workshop;
          return workshop === WorkshopType.ADVANCED ||
            workshop === 'ADVANCED' ||
            workshop === 'advanced';
        },
        tech: (date) => {
          const workshop = dateMap?.get(format(date, "yyyy-MM-dd"))?.workshop;
          return workshop === WorkshopType.TECH ||
            workshop === 'TECH' ||
            workshop === 'tech';
        },
        unavailable: (date) => {
          const workshop = dateMap?.get(format(date, "yyyy-MM-dd"))?.workshop;
          return workshop === WorkshopType.UNAVAILABLE ||
            workshop === 'UNAVAILABLE' ||
            workshop === 'unavailable';
        },
      }}
      modifiersClassNames={{
        tech: "bg-green-200 hover:bg-green-300",
        family: "bg-sky-200 hover:bg-sky-300",
        advanced: "bg-pink-200 hover:bg-pink-300",
        unavailable: "bg-gray-300 hover:bg-gray-300",
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
