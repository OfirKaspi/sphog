"use client"

import PageHeader from "@/components/common/PageHeader"
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm"
import VideoTip from "@/components/pages/tips/VideoTip"
import getTipsData from "@/lib/api/tipsData"
import dynamic from "next/dynamic"

const Testimonials = dynamic(() => import("@/components/common/testimonials/Testimonials"), {ssr: false})
const TipsGrid = dynamic(() => import("@/components/pages/tips/TipsGrid"), {ssr: false})

const Tips = () => {
  const data = getTipsData()

  return (
    <section>
      <PageHeader {...data.header} />
      <VideoTip {...data.videoTip} />
      <TipsGrid tips={data.tips} />
      <Testimonials {...data.testimonials} />
      <LeaveDetailsOpenForm {...data.openForm} />
    </section>
  )
}

export default Tips