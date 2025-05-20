import PageHeader from "@/components/common/PageHeader"
import getAboutData from "@/lib/api/aboutData"

const About = () => {
  const data = getAboutData()

  return (
    <section>
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
    </section>
  )
}

export default About