"use server";

import getPublicWorkshopData from "@/lib/api/publicWorkshopData";
import PageHeader from "@/components/common/PageHeader";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import WorkshopList from "@/components/common/WorkshopList";
import { WorkshopData } from "@/types/types";
import WorkshopRegistrationOpenForm from "@/components/forms/workshop-registration-form/WorkshopRegistrationOpenForm";
import Testimonials from "@/components/common/testimonials/Testimonials";


const PublicWorkshop = async () => {
  const data = await getPublicWorkshopData();

  // No type conversion needed anymore since we're using the enum
  const workshopItems: WorkshopData[] = data.workshopItems.map((workshop) => ({
    ...workshop,
    scrollToForm: true,
  }));

  return (
    <section>
      <PageHeader {...data.header} />
      <WorkshopList workshops={workshopItems} />
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