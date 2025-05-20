import PageHeader from "@/components/common/PageHeader"
import getPublicWorkshopData from "@/lib/api/publicWorkshopData"

const PublicWorkshop = () => {
  const data = getPublicWorkshopData()
  
  return (
    <section>
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
    </section>
  )
}

export default PublicWorkshop