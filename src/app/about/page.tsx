"use client";

import PageHeader from "@/components/common/PageHeader";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import AboutUs from "@/components/pages/home/AboutUs";
import getAboutData from "@/lib/api/aboutData";
import dynamic from "next/dynamic";

const ShortsShowcase = dynamic(() => import("@/components/pages/home/ShortsShowcase"), { ssr: false })
const Testimonials = dynamic(() => import("@/components/common/testimonials/Testimonials"), { ssr: false })

const About = () => {
  const data = getAboutData();

  return (
    <section>
      <PageHeader {...data.pageHeader} />
      <AboutUs
        {...data.aboutUs}
        isBgPrimary={false}
        isNonePaddingBottom={true}
      />
      <ShortsShowcase {...data.shortsShowcase} isBgPrimary={false} />
      <Testimonials {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  );
};

export default About;