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
    if (!products.length) {
        return null
    }

    const previewGridClassName =
        products.length === 1
            ? "max-w-md px-0 pb-0 grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 justify-items-center"
            : products.length === 2
                ? "max-w-4xl px-0 pb-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 justify-items-center"
                : "max-w-6xl px-0 pb-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center"

    return (
        <section className="bg-primary">
            <div className="max-w-screen-lg mx-auto py-16 px-5 bg-primary">

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">{title}</h2>

                <ProductList
                    products={products}
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
