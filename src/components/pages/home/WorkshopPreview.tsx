import GalleryCtaLink from "@/components/common/GalleryCtaLink"
import WorkshopItemOld from "@/components/common/WorkshopItemOld"
import { WorkshopData } from "@/types/types"

interface WorkshopPreviewProps {
  title: string
  workshop: WorkshopData
  showGalleryCta?: boolean
}

export default function WorkshopPreview({
  workshop,
  title,
  showGalleryCta = false,
}: WorkshopPreviewProps) {
  return (
    <section className="max-w-screen-lg mx-auto py-16 px-5 flex flex-col items-center justify-center">
      <h2 className="text-3xl md:text-4xl text-primary font-bold mb-10 text-center">{title}</h2>
      <WorkshopItemOld {...workshop} />
      {showGalleryCta ? <GalleryCtaLink className="mt-8 flex justify-center" /> : null}
    </section>
  )
}
