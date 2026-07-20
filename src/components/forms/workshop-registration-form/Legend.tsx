"use client";

import { usePathname } from "next/navigation";
import { WorkshopType } from "@/types/types";

const LegendItem = ({
  color,
  label,
}: {
  color: string;
  label: string;
}) => (
  <div className="flex items-center gap-1">
    <span className={`h-3 w-3 rounded-sm ${color}`} />
    <span className="text-sm">{label}</span>
  </div>
);

const PUBLIC_LEGEND_ITEMS: {
  type: WorkshopType;
  color: string;
  label: string;
}[] = [
  { type: WorkshopType.TECH, color: "bg-green-200", label: "סדנת טכניקות" },
  { type: WorkshopType.FAMILY, color: "bg-sky-200", label: "סדנא משפחתית" },
  {
    type: WorkshopType.ADVANCED,
    color: "bg-pink-200",
    label: "סדנא מתקדמת",
  },
  {
    type: WorkshopType.UNAVAILABLE,
    color: "bg-gray-300",
    label: "לא נותרו מקומות",
  },
];

interface LegendProps {
  presentTypes: Set<WorkshopType>;
}

const Legend = ({ presentTypes }: LegendProps) => {
  const pathname = usePathname();
  const isPrivateWorkshop = pathname === "/private-workshops";
  const hasUnavailable = presentTypes.has(WorkshopType.UNAVAILABLE);

  if (isPrivateWorkshop) {
    const hasAvailable = [...presentTypes].some(
      (type) => type !== WorkshopType.UNAVAILABLE
    );

    return (
      <div className="flex justify-center flex-wrap gap-4 mb-2">
        {hasAvailable && <LegendItem color="bg-pink-200" label="פנוי" />}
        {hasUnavailable && (
          <LegendItem color="bg-gray-300" label="לא נותרו מקומות" />
        )}
      </div>
    );
  }

  const items = PUBLIC_LEGEND_ITEMS.filter((item) =>
    presentTypes.has(item.type)
  );

  if (items.length === 0) return null;

  return (
    <div className="flex justify-center flex-wrap gap-4 mb-2">
      {items.map((item) => (
        <LegendItem key={item.type} color={item.color} label={item.label} />
      ))}
    </div>
  );
};

export default Legend;
