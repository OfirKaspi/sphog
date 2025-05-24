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
		<section>
			<div
				className="flex flex-col h-full rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-900 cursor-pointer overflow-hidden"
				onClick={() => setSelectedImage(product.image.src)}
			>
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
						<p className="text-sm text-slate-900 dark:text-gray-400 mt-1 max-w-[300px] break-words">
							{product.description}
						</p>
					</header>

					{/* Stays at bottom */}
					<div className="mt-4 flex justify-between items-center">
						<span className="text-xl font-semibold text-[hsl(143,48%,34%)]">
							₪{product.price.toFixed(2)}
						</span>

						{/* Availability Indicator */}
						<div className="mt-2">
							{product.isInStock ? (
								<span className="text-sm font-medium text-green-600 dark:text-green-400">
									במלאי
								</span>
							) : (
								<span className="text-sm font-medium text-red-600 dark:text-red-400">
									לא במלאי
								</span>
							)}
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
