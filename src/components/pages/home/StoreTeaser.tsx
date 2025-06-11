import Link from "next/link";
import { LinkType, Product } from "@/types/types";
import ProductItem from "@/components/pages/store/ProductItem";
import CTAButton from "@/components/common/CTAButton";

interface StoreTeaserProps {
    title: string;
    link: LinkType,
    products: Product[];
}

export default function StoreTeaser({ products, title, link }: StoreTeaserProps) {
    return (
        <section className="bg-primary">
            <div className="max-w-screen-lg mx-auto py-16 px-5 bg-primary">

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">{title}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <ProductItem key={product._id} product={product} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href={link.href}>
                        <CTAButton>
                            {link.text}
                        </CTAButton>
                    </Link>
                </div>
            </div>
        </section>
    );
}
