import Link from "next/link";
import Image from "next/image";
import { Image as ImageType } from "@/types/types";
import { Button } from "@/components/ui/button";

interface WorkshopData {
    title: string;
    description: string;
    image: ImageType;
    link: {
        href: string;
        text: string;
    };
}

interface WorkshopPreviewProps {
    title: string;
    workshops: WorkshopData[];
}

export default function WorkshopPreview({ workshops, title }: WorkshopPreviewProps) {
    return (
        <section className="max-w-screen-lg mx-auto py-16 px-5">
            <h2 className="text-3xl md:text-4xl text-primary font-bold mb-10 text-center">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {workshops.map((workshop, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border flex flex-col"
                    >
                        <Image
                            src={workshop.image.src}
                            alt={workshop.image.alt}
                            width={800}
                            height={400}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-6 flex flex-col justify-between gap-6">
                            <div>
                                <h3 className="text-xl md:text-2xl text-primary font-semibold mb-2">{workshop.title}</h3>
                                <p className="text-sm md:text-base leading-relaxed">{workshop.description}</p>
                            </div>
                            <Link href={workshop.link.href}>
                                <Button className="md:text-base bg-cta hover:bg-cta-foreground transition-all duration-300 rounded-full px-6 py-3 shadow-md">
                                    {workshop.link.text}
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
} 
