"use client"

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react"

import GalleryLightbox from "@/components/pages/gallery/GalleryLightbox"
import {
  galleryOptimizedSrc,
  type GalleryGridItem,
} from "@/components/pages/gallery/galleryImage"

export type { GalleryGridItem }
export { galleryOptimizedSrc }

/**
 * Shared masonry layout for admin editor/preview (CSS columns).
 * Public GalleryGrid uses stable JS columns instead so items don't jump mid-load.
 * 2 → 3 → 4 columns; native aspect ratios preserved.
 */
export const GALLERY_MASONRY_CLASS =
  "columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-3 lg:gap-4 [column-fill:_balance]"

export const GALLERY_ITEM_CLASS = "mb-2 break-inside-avoid md:mb-3 lg:mb-4"

/** @deprecated Use GALLERY_MASONRY_CLASS — kept as alias so admin stays in sync. */
export const GALLERY_MASONRY_ADMIN_CLASS = GALLERY_MASONRY_CLASS

/** @deprecated Use GALLERY_ITEM_CLASS — kept as alias so admin stays in sync. */
export const GALLERY_ITEM_ADMIN_CLASS = GALLERY_ITEM_CLASS

const MD_MIN = 768
const LG_MIN = 1024

function galleryColumnCountForWidth(width: number) {
  if (width >= LG_MIN) return 4
  if (width >= MD_MIN) return 3
  return 2
}

function useGalleryColumnLayout() {
  const [columnCount, setColumnCount] = useState(2)
  const [layoutReady, setLayoutReady] = useState(false)

  useEffect(() => {
    const update = () => setColumnCount(galleryColumnCountForWidth(window.innerWidth))
    update()
    setLayoutReady(true)
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return { columnCount, layoutReady }
}

/** Round-robin into columns — preserves sort order LTR and never moves items across columns as heights resolve. */
function distributeToColumns<T>(items: T[], columnCount: number): T[][] {
  const columns = Array.from({ length: columnCount }, () => [] as T[])
  items.forEach((item, index) => {
    columns[index % columnCount].push(item)
  })
  return columns
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error("Failed to preload image"))
    img.src = src
    if (img.complete) {
      if (img.naturalWidth > 0) {
        resolve()
      } else {
        reject(new Error("Failed to preload image"))
      }
    }
  })
}

function GalleryImageSkeleton({ minHeight = 160 }: { minHeight?: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-xl bg-slate-200"
      style={{ minHeight }}
      aria-hidden
    />
  )
}

function GalleryTile({
  image,
  enableLightbox,
  isOpening,
  openingBusy,
  onOpen,
}: {
  image: GalleryGridItem
  enableLightbox: boolean
  isOpening: boolean
  openingBusy: boolean
  onOpen: (image: GalleryGridItem) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const src = galleryOptimizedSrc(image.src)

  const imageEl = (
    <>
      {!loaded ? <GalleryImageSkeleton /> : null}
      <img
        src={src}
        alt={image.alt}
        className={`w-full rounded-xl transition-opacity duration-300 ${
          loaded
            ? `h-auto ${isOpening ? "opacity-80" : enableLightbox ? "opacity-100 hover:opacity-95" : "opacity-100"}`
            : "absolute inset-0 h-full object-cover opacity-0"
        }`}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  )

  if (!enableLightbox) {
    return (
      <figure className={GALLERY_ITEM_CLASS}>
        <div className="relative overflow-hidden rounded-xl">{imageEl}</div>
      </figure>
    )
  }

  return (
    <figure className={GALLERY_ITEM_CLASS}>
      <button
        type="button"
        onClick={() => onOpen(image)}
        disabled={openingBusy}
        className={`relative block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          isOpening ? "cursor-wait" : "cursor-zoom-in"
        } ${openingBusy && !isOpening ? "opacity-60" : ""}`}
        aria-label={image.alt ? `הגדל: ${image.alt}` : "הגדל תמונה"}
        aria-busy={isOpening}
      >
        {imageEl}
        {isOpening ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/15">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </span>
        ) : null}
      </button>
    </figure>
  )
}

export function GalleryGridSkeleton({
  count = 8,
  columnCount = 2,
  className = "",
}: {
  count?: number
  columnCount?: number
  className?: string
}) {
  const placeholders = useMemo(
    () => Array.from({ length: count }, (_, index) => index),
    [count]
  )
  const columns = useMemo(
    () => distributeToColumns(placeholders, columnCount),
    [placeholders, columnCount]
  )

  return (
    <div className={`flex gap-2 md:gap-3 lg:gap-4 ${className}`} aria-busy="true" aria-label="טוען גלריה">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex min-w-0 flex-1 flex-col">
          {column.map((index) => (
            <div key={index} className={GALLERY_ITEM_CLASS}>
              <GalleryImageSkeleton minHeight={120 + (index % 3) * 48} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

type GalleryGridProps = {
  images: GalleryGridItem[]
  className?: string
  /** Open a lightbox on click (public gallery). Off for admin DnD. */
  enableLightbox?: boolean
}

/** Stable multi-column masonry that preserves sort order while images load. */
export default function GalleryGrid({
  images,
  className = "",
  enableLightbox = true,
}: GalleryGridProps) {
  const [activeImage, setActiveImage] = useState<GalleryGridItem | null>(null)
  const [openingId, setOpeningId] = useState<string | null>(null)
  const openRequestId = useRef(0)
  const { columnCount, layoutReady } = useGalleryColumnLayout()

  const columns = useMemo(
    () => distributeToColumns(images, columnCount),
    [images, columnCount]
  )

  const openLightbox = async (image: GalleryGridItem) => {
    const requestId = ++openRequestId.current
    setOpeningId(image.id)
    const src = galleryOptimizedSrc(image.src)

    try {
      await preloadImage(src)
    } catch {
      // Still open — better than blocking forever on a bad asset
    }

    if (openRequestId.current !== requestId) {
      return
    }

    setActiveImage(image)
    setOpeningId(null)
  }

  if (images.length === 0) {
    return null
  }

  if (!layoutReady) {
    return (
      <GalleryGridSkeleton
        count={Math.min(images.length, 12)}
        columnCount={columnCount}
        className={className}
      />
    )
  }

  return (
    <>
      <div className={`flex gap-2 md:gap-3 lg:gap-4 ${className}`}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex min-w-0 flex-1 flex-col">
            {column.map((image) => (
              <GalleryTile
                key={image.id}
                image={image}
                enableLightbox={enableLightbox}
                isOpening={openingId === image.id}
                openingBusy={Boolean(openingId)}
                onOpen={(next) => void openLightbox(next)}
              />
            ))}
          </div>
        ))}
      </div>

      {enableLightbox ? (
        <GalleryLightbox
          image={activeImage}
          open={Boolean(activeImage)}
          onOpenChange={(open) => {
            if (!open) {
              setActiveImage(null)
              setOpeningId(null)
              openRequestId.current += 1
            }
          }}
        />
      ) : null}
    </>
  )
}
