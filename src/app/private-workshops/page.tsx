import PageHeader from "@/components/common/PageHeader";
import Testimonials from "@/components/common/testimonials/Testimonials";
import WorkshopList from "@/components/common/WorkshopList";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import WorkshopRegistrationOpenForm from "@/components/forms/workshop-registration-form/WorkshopRegistrationOpenForm";
import AboutUs from "@/components/pages/home/AboutUs";
import getPrivateWorkshopData from "@/lib/api/privateWorkshopData";

const PrivateWorkshop = () => {
  const data = getPrivateWorkshopData();

  return (
    <section>
      <PageHeader {...data.header} />
      <AboutUs {...data.aboutUs} isBgPrimary={false} />
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

export default PrivateWorkshop;