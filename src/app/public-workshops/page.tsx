"use client"

import getPublicWorkshopData from "@/lib/api/publicWorkshopData";
import PageHeader from "@/components/common/PageHeader";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import WorkshopList from "@/components/common/WorkshopList";
import dynamic from "next/dynamic";

const WorkshopRegistrationOpenForm = dynamic(() => import("@/components/forms/workshop-registration-form/WorkshopRegistrationOpenForm"), {ssr: false})
const Testimonials = dynamic(() => import("@/components/common/testimonials/Testimonials"), {ssr: false})

const PublicWorkshop = () => {
  const data = getPublicWorkshopData();

  return (
    <section>
      <PageHeader {...data.header} />
      <WorkshopList workshops={data.workshopItems.map((workshop) => ({
        ...workshop,
        scrollToForm: true, // Enable scrollToForm for workshops on this page
      }))} />
      <div id="workshop-form">
        <WorkshopRegistrationOpenForm
          title={data.workshopFormData.header.title}
          description={data.workshopFormData.header.description}
          availableDates={data.workshopFormData.availableDates}
        />
      </div>
      <Testimonials {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  );
};

export default PublicWorkshop;