import { Product } from "@/types/types";
import ProductItem from "./ProductItem";

interface ProductListProps {
    products: Product[];
    className?: string;
    itemClassName?: string;
}

const ProductList = ({ products, className, itemClassName }: ProductListProps) => {
    if (!products.length) {
        return (
            <div className="mx-auto max-w-screen-xl px-4 pb-12 text-center text-gray-500 sm:px-5">
                אין מוצרים זמינים כרגע.
            </div>
        )
    }

    return (
        <div className={`mx-auto grid max-w-screen-xl grid-cols-1 gap-4 px-4 pb-12 sm:grid-cols-2 sm:gap-5 sm:px-5 lg:grid-cols-3 xl:grid-cols-4 ${className ?? ""}`}>
            {products.map((product) => (
                <ProductItem key={product._id} product={product} className={itemClassName ?? "min-h-full"} />
            ))}
        </div>
    );
};

export default ProductList;
