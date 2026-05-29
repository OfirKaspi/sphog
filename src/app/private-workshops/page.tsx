import PageHeader from "@/components/common/PageHeader";
import Testimonials from "@/components/common/testimonials/Testimonials";
import VideoContainer from "@/components/common/VideoContainer";
import PrivateWorkshopLogosCarousel from "@/components/pages/private-workshops/PrivateWorkshopLogosCarousel";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import WorkshopRegistrationOpenForm from "@/components/forms/workshop-registration-form/WorkshopRegistrationOpenForm";
import AboutUs from "@/components/pages/home/AboutUs";
import getPrivateWorkshopData from "@/lib/api/privateWorkshopData";

export const dynamic = "force-dynamic";

const PrivateWorkshop = async () => {
  const data = await getPrivateWorkshopData();

  return (
    <section>
      <PageHeader {...data.header} />
      {data.logosCarousel.logos.length > 0 ? (
        <PrivateWorkshopLogosCarousel heading={data.logosCarousel.heading} logos={data.logosCarousel.logos} />
      ) : null}
      <div className="md:max-w-4xl 2xl:max-w-screen-lg mx-auto px-5 pb-16 pt-8">
        <VideoContainer {...data.videoContainer} />
      </div>
      <AboutUs {...data.aboutUs}/>
      <WorkshopRegistrationOpenForm
        title={data.workshopFormData.header.title}
        description={data.workshopFormData.header.description}
        availableDates={data.workshopFormData.availableDates}
      />
      <Testimonials {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  );
};

export default PrivateWorkshop;