import FAQ from "@/components/common/FAQ";
import Testimonials from "@/components/common/testimonials/Testimonials";
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm";
import AboutUs from "@/components/pages/home/AboutUs";
import Hero from "@/components/pages/home/Hero";
import ShortsShowcase from "@/components/pages/home/ShortsShowcase";
import StoreTeaser from "@/components/pages/home/StoreTeaser";
import TipsSection from "@/components/pages/home/TipsSection";
import WorkshopPreview from "@/components/pages/home/WorkshopPreview";
import getHomeData from "@/lib/api/homeData";
import { useEffect } from "react";

const Home = () => {
  const data = getHomeData();
  useEffect(() => {
    //
  }, []);
  return <></>;

  //   <section className="relative w-full">
  //     {data.hero.isEnabled && <Hero {...data.hero} />}
  //     {data.shortsShowcase.isEnabled && <ShortsShowcase {...data.shortsShowcase} />}
  //     {data.workshopPreviewData.isEnabled && <WorkshopPreview {...data.workshopPreviewData} />}
  //     {data.storeTeaser.isEnabled && <StoreTeaser {...data.storeTeaser} />}
  //     {data.tipsSection.isEnabled && <TipsSection {...data.tipsSection} />}
  //     {data.aboutUs.isEnabled && <AboutUs {...data.aboutUs} />}
  //     {data.testimonials.isEnabled && <Testimonials {...data.testimonials} />}
  //     {data.faq.isEnabled && <FAQ {...data.faq} />}
  //     {data.openForm.isEnabled && (
  //       <div className="py-16">
  //         <LeaveDetailsOpenForm {...data.openForm} />
  //       </div>
  //     )}
  //   </section>
  // )
};

export default Home;
