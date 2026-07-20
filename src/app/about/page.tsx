import dynamic from "next/dynamic"

import PageHeader from "@/components/common/PageHeader"
import TestimonialsSection from "@/components/common/testimonials/TestimonialsSection"
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm"
import AboutUs from "@/components/pages/home/AboutUs"
import getAboutData from "@/lib/api/aboutData"

const ShortsShowcase = dynamic(() => import("@/components/pages/home/ShortsShowcase"), {
  ssr: false,
})

const About = async () => {
  const data = getAboutData()

  return (
    <section>
      <PageHeader {...data.pageHeader} />
      <AboutUs {...data.aboutUs} isBgPrimary={false} isNonePaddingBottom={true} />
      <ShortsShowcase {...data.shortsShowcase} isBgPrimary={false} />
      <TestimonialsSection {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  )
}

export default About
