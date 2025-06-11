import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm"
import ProductList from "@/components/pages/store/ProductList"
import getStoreData from "@/lib/api/storeData"

const Store = () => {
  const data = getStoreData()

  return (
    <section>
      <PageHeader {...data.header} />
      <ProductList products={data.products} />
      <PageHeader {...data.promoHeader} />
      <ProductList products={data.promoProducts} />
      <Testimonials {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  )
}

export default Store