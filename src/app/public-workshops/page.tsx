import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import getPublicWorkshopData from "@/lib/api/publicWorkshopData"

const PublicWorkshop = () => {
  const data = getPublicWorkshopData()

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

export default PublicWorkshop