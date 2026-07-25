"use server";

import getPublicWorkshopData from "@/lib/api/publicWorkshopData";
import ViewContentTracker from "@/components/analytics/ViewContentTracker";
import GalleryCtaLink from "@/components/common/GalleryCtaLink";
import PageHeader from "@/components/common/PageHeader";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import WorkshopList from "@/components/common/WorkshopList";
import { WorkshopData } from "@/types/types";
import WorkshopRegistrationOpenForm from "@/components/forms/workshop-registration-form/WorkshopRegistrationOpenForm";
import TestimonialsSection from "@/components/common/testimonials/TestimonialsSection";
import { isGalleryNavVisible } from "@/lib/api/galleryData";


const PublicWorkshop = async () => {
  const [data, showGallery] = await Promise.all([
    getPublicWorkshopData(),
    isGalleryNavVisible(),
  ]);

  // No type conversion needed anymore since we're using the enum
  const workshopItems: WorkshopData[] = data.workshopItems.map((workshop) => ({
    ...workshop,
    scrollToForm: true,
  }));

  return (
    <section>
      <ViewContentTracker contentName="/public-workshops" />
      <PageHeader {...data.header} />
      <WorkshopList
        workshops={workshopItems}
        footer={showGallery ? <GalleryCtaLink className="mt-2 flex justify-center" /> : null}
      />
      <div id="workshop-form">
        <WorkshopRegistrationOpenForm
          title={data.workshopFormData.header.title}
          description={data.workshopFormData.header.description}
          availableDates={data.workshopFormData.availableDates}
        />
      </div>
      <TestimonialsSection {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  );
};

export default PublicWorkshop;