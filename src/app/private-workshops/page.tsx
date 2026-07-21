import ViewContentTracker from "@/components/analytics/ViewContentTracker";
import PageHeader from "@/components/common/PageHeader";
import TestimonialsSection from "@/components/common/testimonials/TestimonialsSection";
import VideoContainer from "@/components/common/VideoContainer";
import PrivateWorkshopLogosCarousel from "@/components/pages/private-workshops/PrivateWorkshopLogosCarousel";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import WorkshopRegistrationOpenForm from "@/components/forms/workshop-registration-form/WorkshopRegistrationOpenForm";
import AboutUs from "@/components/pages/home/AboutUs";
import { isGalleryNavVisible } from "@/lib/api/galleryData";
import getPrivateWorkshopData from "@/lib/api/privateWorkshopData";
import { GALLERY_CTA_LABEL } from "@/lib/constants/gallery";

export const dynamic = "force-dynamic";

const PrivateWorkshop = async () => {
  const [data, showGallery] = await Promise.all([
    getPrivateWorkshopData(),
    isGalleryNavVisible(),
  ]);

  return (
    <section>
      <ViewContentTracker contentName="/private-workshops" />
      <PageHeader {...data.header} align="center" />
      {data.logosCarousel.logos.length > 0 ? (
        <PrivateWorkshopLogosCarousel heading={data.logosCarousel.heading} logos={data.logosCarousel.logos} />
      ) : null}
      <div className="md:max-w-4xl 2xl:max-w-screen-lg mx-auto px-5 pb-16 pt-8">
        <VideoContainer {...data.videoContainer} />
      </div>
      <AboutUs
        {...data.aboutUs}
        link={
          showGallery
            ? { href: "/gallery", text: GALLERY_CTA_LABEL }
            : undefined
        }
      />
      <WorkshopRegistrationOpenForm
        title={data.workshopFormData.header.title}
        description={data.workshopFormData.header.description}
        availableDates={data.workshopFormData.availableDates}
      />
      <TestimonialsSection {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  );
};

export default PrivateWorkshop;