import PageHeader from "@/components/common/PageHeader";
import Testimonials from "@/components/common/testimonials/Testimonials";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import AboutUs from "@/components/pages/home/AboutUs";
import ShortsShowcase from "@/components/pages/home/ShortsShowcase";
import getAboutData from "@/lib/api/aboutData";

const About = () => {
  const data = getAboutData();

  return (
    <section>
      <PageHeader {...data.pageHeader} />
      <div className="-mb-8 md:mb-0">
        <AboutUs
          {...data.aboutUs}
          isDesktopColumn={false}
          isBgPrimary={false}
        />
      </div>
      <ShortsShowcase {...data.shortsShowcase} isBgPrimary={false} />
      <Testimonials {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  );
};

export default About;