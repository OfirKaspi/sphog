import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm"
import AboutMission from "@/components/pages/about/AboutMission"
import AboutValues from "@/components/pages/about/AboutValues"
import getAboutData from "@/lib/api/aboutData"

const About = () => {
  const data = getAboutData()

  return (
    <section >
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
      <div className="space-y-5 md:space-y-10 mb-5 md:mb-10">
        <AboutMission
          title={data.aboutMission.title}
          subtitle={data.aboutMission.subtitle}
          points={data.aboutMission.points}
        />
        <AboutValues
          title={data.aboutValues.title}
          values={data.aboutValues.values}
        />
        <Testimonials
          title={data.testimonials.title}
          testimonials={data.testimonials.items}
        />
        <LeaveDetailsOpenForm
          title={data.openForm.title}
          description={data.openForm.description}
        />
      </div>
    </section>
  )
}

export default About