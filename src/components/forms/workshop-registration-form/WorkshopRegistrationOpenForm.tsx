"use client";

import { useState } from "react";
import WorkshopRegistrationForm from "@/components/forms/workshop-registration-form/WorkshopRegistrationForm";

interface WorkshopRegistrationOpenFormProps {
  title: string;
  description: string;
  availableDates: { date: Date; hours: string[] }[];
}

const WorkshopRegistrationOpenForm = ({
  title,
  description,
  availableDates,
}: WorkshopRegistrationOpenFormProps) => {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <section className="max-w-screen-sm mx-auto p-5">
      <div className="p-5 border rounded-lg shadow-lg bg-white">
        {!isSuccess && (
          <div className="mb-3 space-y-2 md:space-y-3 text-center">
            <h3 className="text-3xl md:text-4xl text-primary leading-relaxed">
              {title}
            </h3>
            <p className="md:text-lg text-slate-900">{description}</p>
          </div>
        )}

        <WorkshopRegistrationForm
          availableDates={availableDates}
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
        />
      </div>
    </section>
  );
};

export default WorkshopRegistrationOpenForm;
