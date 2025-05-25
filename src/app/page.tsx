import Testimonials from "@/components/common/testimonials/Testimonials"
import Hero from "@/components/pages/home/Hero"
import ShortsShowcase from "@/components/pages/home/ShortsShowcase"
import StoreTeaser from "@/components/pages/home/StoreTeaser"
import TipsSection from "@/components/pages/home/TipsSection"
import WorkshopPreview from "@/components/pages/home/WorkshopPreview"
import getHomeData from "@/lib/api/homeData"

const Home = () => {
  const data = getHomeData()

  return (
    <section className="relative w-full">
      <Hero {...data.hero} />
      <ShortsShowcase {...data.shortsShowcase} />
      <WorkshopPreview {...data.workshopPreviewData} />
      <StoreTeaser {...data.storeTeaser} />
      <TipsSection {...data.tipsSection} />
      <Testimonials
        title={data.testimonials.title}
        testimonials={data.testimonials.items}
      />
    </section>
  )
}

export default Home