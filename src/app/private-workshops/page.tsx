import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import getPrivateWorkshopData from "@/lib/api/privateWorkshopData"

const PrivateWorkshop = () => {
  const data = getPrivateWorkshopData()

  return (
    <section>
      <PageHeader {...data.header} />
      <Testimonials {...data.testimonials} />
    </section>
  )
}

export default PrivateWorkshop