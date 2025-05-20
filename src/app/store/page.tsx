import PageHeader from "@/components/common/PageHeader"
import getStoreData from "@/lib/api/storeData"

const Store = () => {
  const data = getStoreData()

  return (
    <section>
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
    </section>
  )
}

export default Store