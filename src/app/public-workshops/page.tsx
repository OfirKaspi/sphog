import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import getPublicWorkshopData from "@/lib/api/publicWorkshopData"

const PublicWorkshop = () => {
  const data = getPublicWorkshopData()

  return (
    <section>
      <PageHeader {...data.header} />
      <Testimonials {...data.testimonials} />
    </section>
  )
}

export default PublicWorkshop