"use client"

import Image from "next/image"
import { Product } from "@/types/types"
import useResponsive from "@/hooks/useResponsive"

interface ProductItemProps {
	product: Product
}

const ProductItem = ({ product }: ProductItemProps) => {
	const { isMobile } = useResponsive()

	return (
		<div className="flex flex-col h-full rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-900 overflow-hidden">
			{isMobile ? (
				<div className="relative w-full h-auto">
					<Image
						src={product.image.src}
						alt={product.image.alt}
						width={800}
						height={600}
						className="object-cover w-full h-auto"
						sizes="100vw"
					/>
				</div>
			) : (
				<div className="relative w-full aspect-square">
					<Image
						src={product.image.src}
						alt={product.image.alt}
						fill
						className="object-cover"
						sizes="33vw"
					/>
				</div>
			)}

			{/* This grows to take up space and pushes the price to the bottom */}
			<div className="flex flex-col justify-between flex-1 p-4 text-right">
				<header>
					<h2 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-[300px] break-words">
						{product.description}
					</p>
				</header>

				{/* Stays at bottom */}
				<div className="mt-4 flex justify-between items-center">
					<span className="text-xl font-semibold text-[hsl(143,48%,34%)]">
						₪{product.price.toFixed(2)}
					</span>
				</div>
			</div>
		</div>
	)
}

export default ProductItem
