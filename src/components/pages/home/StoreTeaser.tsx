import Link from "next/link";
import { LinkType, Product } from "@/types/types";
import ProductList from "@/components/pages/store/ProductList";
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

                <ProductList
                    products={previewProducts}
                    className="mx-auto max-w-6xl px-0 pb-0"
                    itemClassName="w-full max-w-lg max-h-[560px]"
                    itemWrapperClassName="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.8334rem)]"
                />

                {link && (
                    <div className="text-center">
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
