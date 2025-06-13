import { WorkshopData } from "@/types/types";
import WorkshopItemOld from "@/components/common/WorkshopItemOld";

interface WorkshopPreviewProps {
  title: string;
  workshop: WorkshopData;
}

export default function WorkshopPreview({ workshop, title }: WorkshopPreviewProps) {
  return (
    <section className="max-w-screen-lg mx-auto py-16 px-5 flex flex-col items-center justify-center">
      <h2 className="text-3xl md:text-4xl text-primary font-bold mb-10 text-center">{title}</h2>
      <WorkshopItemOld {...workshop} />
    </section>
  );
}
