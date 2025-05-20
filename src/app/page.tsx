import BannerImage from "@/components/common/BannerImage"
import PageHeader from "@/components/common/PageHeader"
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
    </section>
  )
}

export default Home