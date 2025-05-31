import PageHeader from "@/components/common/PageHeader";
import Testimonials from "@/components/common/testimonials/Testimonials";
import WorkshopRegistrationOpenForm from "@/components/forms/workshop-registration-form/WorkshopRegistrationOpenForm";
import getPrivateWorkshopData from "@/lib/api/privateWorkshopData";

const PrivateWorkshop = () => {
  const data = getPrivateWorkshopData();

  return (
    <section>
      <PageHeader {...data.header} />
      <WorkshopRegistrationOpenForm
        title={data.workshopFormData.header.title}
        description={data.workshopFormData.header.description}
        availableDates={data.workshopFormData.availableDates}
      />
      <Testimonials {...data.testimonials} />
    </section>
  );
};

export default PrivateWorkshop;