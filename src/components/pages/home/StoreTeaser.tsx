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
        .slice(0, 3)

    if (!previewProducts.length) {
        return null
    }

    const centeredGridBaseClassName = "mx-auto px-0 pb-0 justify-items-center"
    const previewGridClassName =
        previewProducts.length === 1
            ? `${centeredGridBaseClassName} max-w-md grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1`
            : previewProducts.length === 2
                ? `${centeredGridBaseClassName} max-w-4xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2`
                : `${centeredGridBaseClassName} max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3`

    return (
        <section className="bg-primary">
            <div className="max-w-screen-lg mx-auto py-16 px-5 bg-primary">

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">{title}</h2>

                <ProductList
                    products={previewProducts}
                    className={previewGridClassName}
                    itemClassName="w-full max-w-sm max-h-[560px]"
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
