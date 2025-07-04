"use client";

import React from 'react';
import { usePathname } from "next/navigation";

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

const Legend = () => {
  const pathname = usePathname();
  const isPrivateWorkshop = pathname === "/private-workshops";

  if (isPrivateWorkshop) {
    return (
      <div className="flex justify-center flex-wrap gap-4 mb-2">
        <LegendItem color="bg-pink-200" label="פנוי" />
        <LegendItem color="bg-gray-300" label="לא נותרו מקומות" />
      </div>
    );
  }

  // Default legend for public workshops
  return (
    <div className="flex justify-center flex-wrap gap-4 mb-2">
      <LegendItem color="bg-green-200" label="סדנת טכניקות" />
      <LegendItem color="bg-sky-200" label="סדנא משפחתית" />
      <LegendItem color="bg-pink-200" label="סדנא מתקדמת" />
      <LegendItem color="bg-gray-300" label="לא נותרו מקומות" />
    </div>
  );
};

export default Legend;
