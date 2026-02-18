"use client"

import { Product } from "@/types/types"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import OptimizedImage from "@/components/common/OptimizedImage"
import ProductLeadForm from "@/components/forms/product-lead-form/ProductLeadForm"
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
	const [isOpen, setIsOpen] = useState(false)
	const [isCardImageLoading, setIsCardImageLoading] = useState(true)
	const [isDialogImageLoading, setIsDialogImageLoading] = useState(true)

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

	useEffect(() => {
		if (!isOpen) {
			setIsDialogImageLoading(true)
			return
		}

		let isMounted = true
		setIsDialogImageLoading(true)
		const image = new window.Image()
		image.src = product.image.src

		const markLoaded = () => {
			if (isMounted) {
				setIsDialogImageLoading(false)
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
	}, [isOpen, product.image.src])

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<Card
				className={`group relative h-full overflow-hidden text-right transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col ${className ?? ""}`}
				role="button"
				tabIndex={0}
				onClick={() => setIsOpen(true)}
				onKeyDown={(event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault()
						setIsOpen(true)
					}
				}}
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
						onClick={(event) => {
							event.stopPropagation()
							setIsOpen(true)
						}}
					>
						לרכישה
					</Button>
				</CardFooter>
			</Card>

			<DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0" dir="rtl">
				<DialogTitle className="sr-only">{product.name}</DialogTitle>
				<div className="grid gap-0 md:grid-cols-2" dir="rtl">
					<div className="p-5 md:p-6">
						<h3 className="mb-1 text-xl font-bold text-gray-900">{product.name}</h3>
						<p className="mb-4 text-sm text-slate-600">{product.description}</p>
						<ProductLeadForm productId={product._id} productName={product.name} productImage={product.image.src} />
					</div>
					<div className="h-full min-h-72 bg-slate-50">
						{isDialogImageLoading ? (
							<div className="h-full min-h-72 flex items-center justify-center bg-slate-100">
								<Loader2 className="h-6 w-6 animate-spin text-slate-500" />
							</div>
						) : null}
						<OptimizedImage
							src={product.image.src}
							alt={product.image.alt}
							width={900}
							height={900}
							crop="fit"
							quality={100}
							format="auto"
							className="h-full w-full object-contain"
							onLoad={() => setIsDialogImageLoading(false)}
							onError={() => setIsDialogImageLoading(false)}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ProductItem
