/* components/ui/calendar.tsx */
"use client";

import { he } from "date-fns/locale";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
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
      navLayout="after"
      showOutsideDays={showOutsideDays}
      className={cn("mt-2", className)}
      classNames={{
        root: "relative",
        months: "flex justify-center items-center",
        month: "space-y-4 relative",
        month_caption: "flex w-full mb-1 pl-20",
        caption_label: "text-sm sm:text-base md:text-lg",
        nav: "absolute left-0 top-[-1.5rem] h-10 flex items-center gap-2 z-20",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 p-0 opacity-100 border-primary text-primary bg-background shadow-md hover:bg-accent"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 p-0 opacity-100 border-primary text-primary bg-background shadow-md hover:bg-accent"
        ),
        month_grid: "w-full border-separate border-spacing-y-1",
        weekdays: "flex w-full justify-between gap-2",
        weekday:
          "text-muted-foreground rounded-md w-9 h-9 p-0 font-normal text-[0.8rem] text-center flex items-center justify-center",
        week: "flex w-full justify-between gap-2 mt-1",
        day: cn(
          "h-9 w-9 p-0 relative focus-within:z-20 text-center text-sm",
          "aria-selected:font-semibold"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 rounded-lg border-2 border-transparent font-normal transition-colors duration-150",
          "aria-selected:border-2 aria-selected:border-primary",
          "aria-selected:ring-2 aria-selected:ring-primary/50 aria-selected:ring-offset-1",
          "aria-selected:shadow-sm aria-selected:scale-[1.02]"
        ),
        range_end: "day-range-end",
        today: "bg-accent text-accent-foreground",
        outside: "day-outside text-muted-foreground pointer-events-none",
        disabled: "pointer-events-none",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
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
        selected:
          "[&>button]:border-primary [&>button]:ring-2 [&>button]:ring-primary/50 [&>button]:ring-offset-1",
        tech:
          "[&>button]:bg-green-200 hover:[&>button]:bg-green-300 aria-selected:[&>button]:bg-green-400",
        family:
          "[&>button]:bg-sky-200 hover:[&>button]:bg-sky-300 aria-selected:[&>button]:bg-sky-400",
        advanced:
          "[&>button]:bg-pink-200 hover:[&>button]:bg-pink-300 aria-selected:[&>button]:bg-pink-400",
        unavailable:
          "[&>button]:bg-gray-300 hover:[&>button]:bg-gray-300 aria-selected:[&>button]:bg-gray-300 [&>button]:border-transparent [&>button]:ring-0 [&>button]:ring-offset-0",
      }}
      components={{
        Chevron: ({ orientation, className }) => {
          if (orientation === "left") {
            return <ChevronRight className={cn("h-4 w-4", className)} />;
          }
          if (orientation === "right") {
            return <ChevronLeft className={cn("h-4 w-4", className)} />;
          }
          if (orientation === "up") {
            return <ChevronUp className={cn("h-4 w-4", className)} />;
          }
          return <ChevronDown className={cn("h-4 w-4", className)} />;
        },
      }}
      {...props}
    />
  );
}
