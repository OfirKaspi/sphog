import PageHeader from "@/components/common/PageHeader";
import Testimonials from "@/components/common/testimonials/Testimonials";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import AboutMission from "@/components/pages/about/AboutMission";
import AboutValues from "@/components/pages/about/AboutValues";
import AboutUs from "@/components/pages/home/AboutUs";
import getAboutData from "@/lib/api/aboutData";

const About = () => {
  const data = getAboutData();

  return (
    <section>
      <PageHeader {...data.header} />
      <AboutUs {...data.aboutUs}/>
      <AboutMission {...data.aboutMission} />
      <AboutValues {...data.aboutValues} />
      <Testimonials {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  );
};

export default About;