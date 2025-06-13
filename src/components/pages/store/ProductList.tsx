import { Product } from "@/types/types";
import ProductItem from "./ProductItem";

interface ProductListProps {
    products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5 pb-16 max-w-screen-lg mx-auto">
            {products.map((product) => (
                <ProductItem key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
