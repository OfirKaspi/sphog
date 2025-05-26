import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import ProductList from "@/components/pages/store/ProductList"
import getStoreData from "@/lib/api/storeData"

const Store = () => {
  const data = getStoreData()

  return (
    <section>
      <PageHeader {...data.promoHeader} />
      <ProductList products={data.promoProducts} />
      <PageHeader {...data.header} />
      <ProductList products={data.products} />
      <Testimonials {...data.testimonials} />
    </section>
  )
}

export default Store