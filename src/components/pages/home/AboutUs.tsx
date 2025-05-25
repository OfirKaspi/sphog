import { Button } from "@/components/ui/button";
import { Image as ImageType, LinkType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

export interface AboutUsProps {
    title: string;
    description: string;
    image: ImageType;
    link: LinkType;
}

export default function AboutUs({ title, description, image, link }: AboutUsProps) {
    return (
        <section className="bg-primary text-white text-center md:text-start">
            <div className="max-w-screen-lg mx-auto py-16 px-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
                        <p className="md:text-lg mb-6 leading-relaxed">{description}</p>
                        <Link href={link.href}>
                            <Button className="md:text-base bg-cta hover:bg-cta-foreground transition-all duration-300 rounded-full px-6 py-3 shadow-md">
                                {link.text}
                            </Button>
                        </Link>
                    </div>
                    <div className="order-1 md:order-2">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={600}
                            height={500}
                            className="w-full rounded-xl object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
