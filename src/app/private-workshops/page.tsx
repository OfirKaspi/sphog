"use client"

import PageHeader from "@/components/common/PageHeader";
import VideoContainer from "@/components/common/VideoContainer";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import AboutUs from "@/components/pages/home/AboutUs";
import getPrivateWorkshopData from "@/lib/api/privateWorkshopData";
import dynamic from "next/dynamic";

const WorkshopRegistrationOpenForm = dynamic(() => import("@/components/forms/workshop-registration-form/WorkshopRegistrationOpenForm"), {ssr: false})
const Testimonials = dynamic(() => import("@/components/common/testimonials/Testimonials"), {ssr: false})

const PrivateWorkshop = () => {
  const data = getPrivateWorkshopData();

  return (
    <section>
      <PageHeader {...data.header} />
      <div className="md:max-w-4xl 2xl:max-w-screen-lg px-5 pb-16 mx-auto">
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