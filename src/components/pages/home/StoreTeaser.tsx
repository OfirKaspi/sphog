import Link from "next/link";
import { LinkType, Product } from "@/types/types";
import StoreCarousel from "@/components/pages/home/StoreCarousel";
import CTAButton from "@/components/common/CTAButton";

interface StoreTeaserProps {
    title: string;
    link?: LinkType,
    products: Product[];
}

export default function StoreTeaser({ products, title, link }: StoreTeaserProps) {
    const previewProducts = (products ?? [])
        .filter((product) =>
            Boolean(
                product &&
                product.name?.trim() &&
                product.description?.trim() &&
                product.image?.src?.trim() &&
                Number.isFinite(product.price)
            )
        )

    if (!previewProducts.length) {
        return null
    }

    return (
        <section className="bg-primary">
            <div className="max-w-screen-xl mx-auto py-16 px-5 bg-primary">

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">{title}</h2>

                <StoreCarousel products={previewProducts} />

                {link && (
                    <div className="text-center mt-8">
                        <Link href={link.href}>
                            <CTAButton>
                                {link.text}
                            </CTAButton>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
