"use client"

import { Product } from "@/types/types"
import { useEffect, useState } from "react"
import { Camera, Loader2 } from "lucide-react"
import OptimizedImage from "@/components/common/OptimizedImage"
import ProductLeadForm from "@/components/forms/product-lead-form/ProductLeadForm"
import ProductGallery from "@/components/pages/store/ProductGallery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface ProductItemProps {
	product: Product
	className?: string
}

const ProductItem = ({ product, className }: ProductItemProps) => {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false)
	const [isLeadFormOpen, setIsLeadFormOpen] = useState(false)
	const [isCardImageLoading, setIsCardImageLoading] = useState(true)

	useEffect(() => {
		let isMounted = true
		setIsCardImageLoading(true)
		const image = new window.Image()
		image.src = product.image.src

		const markLoaded = () => {
			if (isMounted) {
				setIsCardImageLoading(false)
			}
		}

		if (image.complete) {
			markLoaded()
		} else {
			image.onload = markLoaded
			image.onerror = markLoaded
		}

		return () => {
			isMounted = false
			image.onload = null
			image.onerror = null
		}
	}, [product.image.src])

	const imageCount = product.galleryImages.length

	return (
		<>
			<Card
				className={`group relative h-full overflow-hidden text-right transition-all duration-200 hover:shadow-lg flex flex-col ${className ?? ""}`}
			>
			<div className="absolute left-3 top-3 z-20">
				<Badge
					className={
					product.isInStock
						? "bg-pink-600 text-white border-pink-700"
						: "bg-slate-700 text-white border-slate-800"
					}
				>
					{product.isInStock
						? product.originalPrice ? "במבצע" : "במלאי"
						: "לא במלאי"}
				</Badge>
			</div>

				<div
					role="button"
					tabIndex={0}
					onClick={() => setIsGalleryOpen(true)}
					onKeyDown={(event) => {
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault()
							setIsGalleryOpen(true)
						}
					}}
					className="relative cursor-zoom-in"
					aria-label={`פתח גלריית תמונות - ${imageCount} תמונות`}
				>
					<AspectRatio ratio={1}>
						{!product.isInStock ? (
							<div className="absolute inset-0 z-[1] bg-slate-700/20 pointer-events-none" aria-hidden="true" />
						) : null}
						{isCardImageLoading ? (
							<div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
								<Loader2 className="h-5 w-5 animate-spin text-slate-500" />
							</div>
						) : null}
						<OptimizedImage
							src={product.image.src}
							alt={product.image.alt}
							width={800}
							height={800}
							crop="fill"
							quality={100}
							format="auto"
							className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
							onLoad={() => setIsCardImageLoading(false)}
							onError={() => setIsCardImageLoading(false)}
						/>
					</AspectRatio>

					{imageCount > 1 && (
						<div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
							<Camera className="h-3.5 w-3.5" />
							<span>{imageCount}</span>
						</div>
					)}
				</div>

				<CardHeader className="space-y-1 p-4 pb-2">
					<div className="space-y-1">
						<h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
						<p className="line-clamp-3 text-sm text-slate-700">{product.description}</p>
					</div>
				</CardHeader>

				<CardContent className="px-4 pb-3 pt-0 flex-1">
					<div>
						<div className="space-y-0.5">
							{product.originalPrice ? (
								<span
									className="block text-base font-medium text-gray-500 line-through"
									aria-label={`Original price: ₪${product.originalPrice.toFixed(0)}`}
								>
									₪{product.originalPrice.toFixed(0)}
								</span>
							) : null}
							<span
								className="text-2xl font-bold text-green-700"
								aria-label={`Current price: ₪${product.price.toFixed(0)}`}
							>
								₪{product.price.toFixed(0)}
							</span>
						</div>
					</div>
				</CardContent>
				<CardFooter className="px-4 pb-4 pt-0 mt-auto">
					<Button
						type="button"
						className="w-full bg-cta hover:bg-cta-foreground text-white font-bold"
						onClick={() => setIsLeadFormOpen(true)}
					>
						לרכישה
					</Button>
				</CardFooter>
			</Card>

			<Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
				<DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-hidden p-0" dir="rtl">
					<DialogTitle className="sr-only">תמונות - {product.name}</DialogTitle>
					<div className="h-[60vh] sm:h-[70vh] md:h-[80vh]">
						<ProductGallery images={product.galleryImages} productName={product.name} />
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
				<DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl overflow-hidden p-0" dir="rtl">
					<DialogTitle className="sr-only">{product.name}</DialogTitle>
					<div className="flex flex-col md:grid md:grid-cols-2 md:h-[32rem]" dir="rtl">
						<div className="p-4 sm:p-5 md:p-6 overflow-y-auto order-2 md:order-1">
							<h3 className="mb-1 text-xl font-bold text-gray-900">{product.name}</h3>
							<p className="mb-4 text-sm text-slate-600">{product.description}</p>
							<ProductLeadForm productId={product._id} productName={product.name} productImage={product.image.src} />
						</div>
						<div className="h-56 sm:h-72 md:h-full shrink-0 overflow-hidden order-1 md:order-2">
							<ProductGallery images={product.galleryImages} productName={product.name} />
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default ProductItem
