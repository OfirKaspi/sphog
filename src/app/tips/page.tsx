import PageHeader from "@/components/common/PageHeader"
import TestimonialsSection from "@/components/common/testimonials/TestimonialsSection"
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm"
import TipsGrid from "@/components/pages/tips/TipsGrid"
import VideoTip from "@/components/pages/tips/VideoTip"
import getTipsData from "@/lib/api/tipsData"

const Tips = async () => {
  const data = getTipsData()

  return (
    <section>
      <PageHeader {...data.header} align="center" />
      <VideoTip {...data.videoTip} />
      <TipsGrid tips={data.tips} />
      <TestimonialsSection {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  )
}

export default Tips
