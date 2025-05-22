import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import ProductList from "@/components/pages/store/ProductList"
import getStoreData from "@/lib/api/storeData"

const Store = () => {
  const data = getStoreData()

  return (
    <section>
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
      <div className="space-y-5 md:space-y-10 mb-5 md:mb-10">
        <ProductList
          products={data.products}
        />
        <Testimonials
          title={data.testimonials.title}
          testimonials={data.testimonials.items}
        />
      </div>
    </section>
  )
}

export default Store