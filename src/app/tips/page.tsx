import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import TipsGrid from "@/components/pages/tips/TipsGrid"
import VideoTip from "@/components/pages/tips/VideoTip"
import getTipsData from "@/lib/api/tipsData"

const Tips = () => {
  const data = getTipsData()

  return (
    <section>
      <VideoTip {...data.videoTip} />
      <PageHeader {...data.header} />
      <div className="p-5">
        <TipsGrid tips={data.tips} />
      </div>
      <Testimonials {...data.testimonials} />
    </section>
  )
}

export default Tips