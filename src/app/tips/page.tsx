import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/Testimonials"
import TipsGrid from "@/components/pages/tips/TipsGrid"
import getTipsData from "@/lib/api/tipsData"

const Tips = () => {
  const data = getTipsData()

  return (
    <section className="space-y-5 md:space-y-10 mb-5 md:mb-10">
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
      <TipsGrid
        tips={data.tips}
      />
      <Testimonials
        title={data.testimonials.title}
        testimonials={data.testimonials.items}
      />
    </section>
  )
}

export default Tips