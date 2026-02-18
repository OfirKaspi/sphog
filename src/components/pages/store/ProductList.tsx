import { Product } from "@/types/types";
import ProductItem from "./ProductItem";

interface ProductListProps {
    products: Product[];
    className?: string;
    itemClassName?: string;
    itemWrapperClassName?: string;
}

const defaultItemWrapperClassName = "w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.8334rem)] xl:w-[calc(25%-0.9375rem)]"

const ProductList = ({ products, className, itemClassName, itemWrapperClassName }: ProductListProps) => {
    if (!products.length) {
        return (
            <div className="mx-auto max-w-screen-xl px-4 pb-12 text-center text-gray-500 sm:px-5">
                אין מוצרים זמינים כרגע.
            </div>
        )
    }

    const gridClassName = className
        ? `mx-auto flex flex-wrap justify-center gap-4 px-4 pb-12 sm:gap-5 sm:px-5 ${className}`
        : "mx-auto flex max-w-screen-xl flex-wrap justify-center gap-4 px-4 pb-12 sm:gap-5 sm:px-5"

    return (
        <div className={gridClassName}>
            {products.map((product) => (
                <div key={product._id} className={itemWrapperClassName ?? defaultItemWrapperClassName}>
                    <ProductItem product={product} className={itemClassName ?? "min-h-full"} />
                </div>
            ))}
        </div>
    );
};

export default ProductList;
