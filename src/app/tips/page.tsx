import PageHeader from "@/components/common/PageHeader"
import Testimonials from "@/components/common/testimonials/Testimonials"
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm"
import TipsGrid from "@/components/pages/tips/TipsGrid"
import VideoTip from "@/components/pages/tips/VideoTip"
import getTipsData from "@/lib/api/tipsData"

const Tips = () => {
  const data = getTipsData()

  return (
    <section>
      <PageHeader {...data.header} />
      <VideoTip {...data.videoTip} />
      <div className="pt-16 px-5">
        <TipsGrid tips={data.tips} />
      </div>
      <Testimonials {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  )
}

export default Tips