import PageHeader from "@/components/common/PageHeader"
import ProductList from "@/components/store/ProductList"
import getStoreData from "@/lib/api/storeData"

const Store = () => {
  const data = getStoreData()

  return (
    <section>
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
      <ProductList
        products={data.products}
      />
    </section>
  )
}

export default Store