import PageHeader from "@/components/common/PageHeader"
import getPrivateWorkshopData from "@/lib/api/privateWorkshopData"

const PrivateWorkshop = () => {
  const data = getPrivateWorkshopData()

  return (
    <section>
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
    </section>
  )
}

export default PrivateWorkshop