import PageHeader from "@/components/common/PageHeader";
import Testimonials from "@/components/common/testimonials/Testimonials";
import WorkshopRegistrationOpenForm from "@/components/forms/workshop-registration-form/WorkshopRegistrationOpenForm";
import getPublicWorkshopData from "@/lib/api/publicWorkshopData";
import WorkshopList from "@/components/common/WorkshopList";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";

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