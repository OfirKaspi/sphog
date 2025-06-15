"use client"

import Image from "next/image"
import { Product } from "@/types/types"
import useResponsive from "@/hooks/useResponsive"
import { useState } from "react"
import { X } from "lucide-react"
import CustomModal from "@/components/common/CustomModal"

interface ProductItemProps {
	product: Product
}

const ProductItem = ({ product }: ProductItemProps) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const { isMobile } = useResponsive()

	return (
		<section className="relative">
			<div
				className="flex flex-col h-full rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-900 cursor-pointer overflow-hidden"
				onClick={() => setSelectedImage(product.image.src)}
			>
				{/* Stock Indicator */}
				<div className="absolute top-2 left-2 z-30 px-3 py-2 rounded-md overflow-hidden text-sm font-bold">
					{product.isInStock ? (
						<span className="bg-cta text-white px-2 py-1 rounded-md">במלאי</span>
					) : (
						<span className="bg-gray-500 text-white px-2 py-1 rounded-md">לא במלאי</span>
					)}
				</div>

				{/* Image Section */}
				<div className="relative w-full overflow-hidden">
					{isMobile ? (
						<Image
							src={product.image.src}
							alt={product.image.alt}
							width={800}
							height={600}
							className="object-cover w-full h-auto"
							sizes="100vw"
						/>
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
				</div>

				{/* This grows to take up space and pushes the price to the bottom */}
				<div className="flex flex-col justify-between flex-1 p-4 text-right">
					<header>
						<h2 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h2>
						<p className="text-sm text-slate-900 dark:text-gray-400 mt-1 max-w-[300px] break-words">
							{product.description}
						</p>
					</header>

					{/* Stays at bottom */}
					<div className="mt-4 flex justify-between items-center">
						<div>
							{product.originalPrice && (
								<span className="text-lg font-medium text-gray-500 line-through block">
									₪{product.originalPrice.toFixed(0)}
								</span>
							)}
							<span className="text-xl font-bold text-cta">
								₪{product.price.toFixed(0)}
							</span>
						</div>
					</div>
				</div>

				{/* CUSTOM MODAL */}
			</div>
			{selectedImage && (
				<CustomModal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
					<button
						className="absolute top-2 left-2 text-white bg-black/50 hover:bg-black/80 rounded-full p-1 z-10"
						onClick={() => setSelectedImage(null)}
					>
						<X className="w-5 h-5" />
					</button>

					<Image
						src={selectedImage}
						alt="Full preview"
						width={800}
						height={800}
						className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
						priority
					/>
				</CustomModal>
			)}
		</section>
	)
}

export default ProductItem
