"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import type { Image } from "@/types/types"
import OptimizedImage from "@/components/common/OptimizedImage"

interface ProductGalleryProps {
	images: Image[]
	productName: string
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
	const [activeIndex, setActiveIndex] = useState(0)
	const [isMainLoading, setIsMainLoading] = useState(true)
	const hasMultiple = images.length > 1

	useEffect(() => {
		setIsMainLoading(true)
	}, [activeIndex])

	const goToPrevious = useCallback(() => {
		setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
	}, [images.length])

	const goToNext = useCallback(() => {
		setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
	}, [images.length])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") goToNext()
			else if (e.key === "ArrowRight") goToPrevious()
		}
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [goToNext, goToPrevious])

	const activeImage = images[activeIndex]

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="relative flex-1 min-h-0 overflow-hidden bg-slate-50 flex items-center justify-center">
				{isMainLoading && (
					<div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
						<Loader2 className="h-6 w-6 animate-spin text-slate-500" />
					</div>
				)}

				<OptimizedImage
					src={activeImage.src}
					alt={activeImage.alt}
					width={900}
					height={900}
					crop="fit"
					quality={100}
					format="auto"
					className="max-h-full max-w-full object-contain"
					onLoad={() => setIsMainLoading(false)}
					onError={() => setIsMainLoading(false)}
				/>

				{hasMultiple && (
					<>
						<button
							type="button"
							onClick={goToPrevious}
							className="absolute right-1 sm:right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-1 sm:p-1.5 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
							aria-label="תמונה קודמת"
						>
							<ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
						</button>
						<button
							type="button"
							onClick={goToNext}
							className="absolute left-1 sm:left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-1 sm:p-1.5 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
							aria-label="תמונה הבאה"
						>
							<ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
						</button>

						<div className="absolute bottom-2 sm:bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs text-white backdrop-blur-sm">
							{activeIndex + 1} / {images.length}
						</div>
					</>
				)}
			</div>

			{hasMultiple && (
				<div className="shrink-0 flex justify-center gap-1.5 sm:gap-2 overflow-x-auto p-2 sm:p-3 bg-white" role="list" aria-label={`תמונות של ${productName}`}>
					{images.map((image, index) => (
						<button
							key={index}
							type="button"
							role="listitem"
							onClick={() => setActiveIndex(index)}
							className={`relative flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 overflow-hidden rounded-md sm:rounded-lg border-2 transition-all ${
								index === activeIndex
									? "border-pink-500 ring-2 ring-pink-300"
									: "border-slate-200 hover:border-slate-400"
							}`}
							aria-label={`תמונה ${index + 1} מתוך ${images.length}`}
							aria-current={index === activeIndex ? "true" : undefined}
						>
							<OptimizedImage
								src={image.src}
								alt={image.alt}
								width={160}
								height={160}
								crop="fill"
								quality={80}
								format="auto"
								className="h-full w-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default ProductGallery
