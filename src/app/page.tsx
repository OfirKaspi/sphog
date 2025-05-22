import BannerImage from "@/components/common/BannerImage"
import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import getHomeData from "@/lib/api/homeData"

const Home = () => {
  const data = getHomeData()

  return (
    <section className="relative w-full">
      <PageHeader
        title={data.header.title}
        description={data.header.description}
      />
      <div className="relative">
        <BannerImage
          src={data.bannerImage.src}
          alt={data.bannerImage.alt}
        />
      </div>
      <Testimonials
        title={data.testimonials.title}
        testimonials={data.testimonials.items}
      />
    </section>
  )
}

export default Home