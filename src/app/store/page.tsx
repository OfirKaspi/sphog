import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm"
import ProductList from "@/components/pages/store/ProductList"
import getStoreData from "@/lib/api/storeData"

const Store = async () => {
  const data = await getStoreData()
  const hasAnyProducts = data.products.length > 0 || data.promoProducts.length > 0

  return (
    <section>
      {data.products.length > 0 ? (
        <>
          <PageHeader {...data.header} />
          <ProductList products={data.products} />
        </>
      ) : null}
      {data.promoProducts.length > 0 ? (
        <>
          <PageHeader {...data.promoHeader} />
          <ProductList products={data.promoProducts} />
        </>
      ) : null}
      {!hasAnyProducts ? (
        <div className="mx-auto max-w-screen-xl px-4 py-14 text-center sm:px-5">
          <p className="text-lg font-semibold text-gray-800">החנות תעלה בקרוב</p>
          <p className="mt-2 text-sm text-gray-600">בקרוב יתווספו כאן מוצרים חדשים לרכישה.</p>
        </div>
      ) : null}
      <Testimonials {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  )
}

export default Store