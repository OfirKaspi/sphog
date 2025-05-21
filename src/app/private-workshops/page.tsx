import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/Testimonials"
import getPrivateWorkshopData from "@/lib/api/privateWorkshopData"

const PrivateWorkshop = () => {
  const data = getPrivateWorkshopData()

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

export default PrivateWorkshop