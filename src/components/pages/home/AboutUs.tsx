import CTAButton from "@/components/common/CTAButton";
import { Media, LinkType } from "@/types/types";
import Image from "next/image";
import VideoContainer from "@/components/common/VideoContainer";
import Link from "next/link";

export interface AboutUsProps {
    title?: string;
    paragraphs: string[];
    media: Media;
    link?: LinkType;
    isBgPrimary?: boolean;

}

export default function AboutUs({ isBgPrimary = true, title, paragraphs, media, link }: AboutUsProps) {
    return (
        <section className={`${isBgPrimary ? "bg-primary text-white" : ""} text-center md:text-start`}>
            <div className={`${isBgPrimary ? "py-16 px-5" : "p-5"} mx-auto `}>
                <div className="grid grid-cols-1 gap-10 items-center">
                    <div>
                        {media.type === "video" ? (
                            <VideoContainer src={media.src} title={media.alt} isPortrait={media.isPortrait || false} />
                        ) : (
                            <Image
                                src={media.src}
                                alt={media.alt}
                                width={600}
                                height={500}
                                className="w-full rounded-xl object-contain max-w-2xl mx-auto"
                            />
                        )}
                    </div>
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
                        <p className="md:text-lg mb-6 leading-relaxed">
                            {paragraphs.map((paragraph, index) => (
                                <span key={index}>
                                    {paragraph}
                                    {index < paragraphs.length - 1 && <br />}
                                </span>
                            ))}
                        </p>
                        {link &&
                            <Link href={link.href}>
                                <CTAButton>{link.text}</CTAButton>
                            </Link>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}
