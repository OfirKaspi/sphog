import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/Testimonials"
import getTipsData from "@/lib/api/tipsData"

const Tips = () => {
  const data = getTipsData()

  return (
    <section>
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
      <Testimonials
        title={data.testimonials.title}
        testimonials={data.testimonials.items}
      />
    </section>
  )
}

export default Tips