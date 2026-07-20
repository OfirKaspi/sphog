import { notFound } from "next/navigation"

import PageHeader from "@/components/common/PageHeader"
import TestimonialsSection from "@/components/common/testimonials/TestimonialsSection"
import LeaveDetailsOpenForm from "@/components/forms/leave-details-form/LeaveDetailsOpenForm"
import GalleryGrid from "@/components/pages/gallery/GalleryGrid"
import {
  getGalleryEnabled,
  getPublishedGalleryImages,
} from "@/lib/api/galleryData"
import getHomeData from "@/lib/api/homeData"
import { GALLERY_PAGE_TITLE } from "@/lib/constants/gallery"

export const dynamic = "force-dynamic"

const GalleryPage = async () => {
  const [enabled, images, homeData] = await Promise.all([
    getGalleryEnabled(),
    getPublishedGalleryImages(),
    getHomeData(),
  ])

  if (!enabled || images.length === 0) {
    notFound()
  }

  return (
    <section>
      <PageHeader title={GALLERY_PAGE_TITLE} align="center" />
      <div className="mx-auto max-w-screen-xl px-5 pb-16">
        <GalleryGrid images={images} />
      </div>
      <TestimonialsSection
        {...homeData.testimonials}
        isBgPrimary={true}
        isEnabled={homeData.testimonials.isEnabled}
      />
      {homeData.openForm.isEnabled && <LeaveDetailsOpenForm {...homeData.openForm} />}
    </section>
  )
}

export default GalleryPage
