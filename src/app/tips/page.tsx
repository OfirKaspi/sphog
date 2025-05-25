import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import TipsGrid from "@/components/pages/tips/TipsGrid"
import getTipsData from "@/lib/api/tipsData"

const Tips = () => {
  const data = getTipsData()

  return (
    <section>
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
      <div className="p-5">
      <TipsGrid
        tips={data.tips}
      />
      </div>
      <Testimonials
        title={data.testimonials.title}
        testimonials={data.testimonials.items}
      />
    </section>
  )
}

export default Tips