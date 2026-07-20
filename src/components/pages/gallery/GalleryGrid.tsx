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
 * Shared stable masonry (flex columns). Used by public gallery + admin editor
 * so draft editing matches what visitors see. 2 → 3 → 4 columns.
 */
export const GALLERY_FLEX_CLASS = "flex gap-2 md:gap-3 lg:gap-4"
export const GALLERY_COLUMN_CLASS = "flex min-w-0 flex-1 flex-col"
export const GALLERY_ITEM_CLASS = "mb-2 md:mb-3 lg:mb-4"

/** @deprecated Use GALLERY_FLEX_CLASS */
export const GALLERY_MASONRY_CLASS = GALLERY_FLEX_CLASS
/** @deprecated Use GALLERY_FLEX_CLASS */
export const GALLERY_MASONRY_ADMIN_CLASS = GALLERY_FLEX_CLASS
/** @deprecated Use GALLERY_ITEM_CLASS */
export const GALLERY_ITEM_ADMIN_CLASS = GALLERY_ITEM_CLASS

const MD_MIN = 768
const LG_MIN = 1024

export type GalleryViewportPreset = "mobile" | "tablet" | "desktop"

/** Admin viewport preview: column count + gaps; frame stays within the card (max-width only). */
export const GALLERY_VIEWPORT_PRESETS: Record<
  GalleryViewportPreset,
  {
    columns: number
    maxWidth: number
    flexClass: string
    itemClass: string
    labelHe: string
  }
> = {
  mobile: {
    columns: 2,
    maxWidth: 390,
    flexClass: "flex gap-2",
    itemClass: "mb-2",
    labelHe: "מובייל",
  },
  tablet: {
    columns: 3,
    maxWidth: MD_MIN,
    flexClass: "flex gap-3",
    itemClass: "mb-3",
    labelHe: "טאבלט",
  },
  desktop: {
    columns: 4,
    maxWidth: 1280,
    flexClass: "flex gap-4",
    itemClass: "mb-4",
    labelHe: "דסקטופ",
  },
}

export function galleryColumnCountForWidth(width: number) {
  if (width >= LG_MIN) return 4
  if (width >= MD_MIN) return 3
  return 2
}

export function galleryViewportPresetForWidth(width: number): GalleryViewportPreset {
  const columns = galleryColumnCountForWidth(width)
  if (columns >= 4) return "desktop"
  if (columns >= 3) return "tablet"
  return "mobile"
}

export function galleryClassesForColumns(columnCount: number) {
  if (columnCount >= 4) {
    return { flexClass: "flex gap-4", itemClass: "mb-4" }
  }
  if (columnCount >= 3) {
    return { flexClass: "flex gap-3", itemClass: "mb-3" }
  }
  return { flexClass: "flex gap-2", itemClass: "mb-2" }
}

/** Column breakpoints from viewport width (public gallery page). */
export function useGalleryColumnLayout() {
  const [columnCount, setColumnCount] = useState(2)
  const [layoutReady, setLayoutReady] = useState(false)

  useEffect(() => {
    const update = () => {
      setColumnCount(galleryColumnCountForWidth(window.innerWidth))
      setLayoutReady(true)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return { columnCount, layoutReady }
}

/** Round-robin into columns — preserves sort order LTR; items never move across columns as heights resolve. */
export function distributeGalleryToColumns<T>(items: T[], columnCount: number): T[][] {
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
  itemClassName = GALLERY_ITEM_CLASS,
}: {
  image: GalleryGridItem
  enableLightbox: boolean
  isOpening: boolean
  openingBusy: boolean
  onOpen: (image: GalleryGridItem) => void
  itemClassName?: string
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
      <figure className={itemClassName}>
        <div className="relative overflow-hidden rounded-xl">{imageEl}</div>
      </figure>
    )
  }

  return (
    <figure className={itemClassName}>
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
  flexClass,
  itemClass,
}: {
  count?: number
  columnCount?: number
  className?: string
  flexClass?: string
  itemClass?: string
}) {
  const placeholders = useMemo(
    () => Array.from({ length: count }, (_, index) => index),
    [count]
  )
  const columns = useMemo(
    () => distributeGalleryToColumns(placeholders, columnCount),
    [placeholders, columnCount]
  )
  const resolved = galleryClassesForColumns(columnCount)
  const rowClass = flexClass ?? resolved.flexClass
  const tileClass = itemClass ?? resolved.itemClass

  return (
    <div className={`${rowClass} ${className}`} aria-busy="true" aria-label="טוען גלריה">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className={GALLERY_COLUMN_CLASS}>
          {column.map((index) => (
            <div key={index} className={tileClass}>
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
  /**
   * Force a column count (admin viewport preview). When set, gaps match that
   * preset instead of the live CSS breakpoints.
   */
  forcedColumnCount?: number
}

/** Stable multi-column masonry that preserves sort order while images load. */
export default function GalleryGrid({
  images,
  className = "",
  enableLightbox = true,
  forcedColumnCount,
}: GalleryGridProps) {
  const [activeImage, setActiveImage] = useState<GalleryGridItem | null>(null)
  const [openingId, setOpeningId] = useState<string | null>(null)
  const openRequestId = useRef(0)
  const liveLayout = useGalleryColumnLayout()
  const columnCount = forcedColumnCount ?? liveLayout.columnCount
  const layoutReady = forcedColumnCount != null ? true : liveLayout.layoutReady
  const { flexClass, itemClass } =
    forcedColumnCount != null
      ? galleryClassesForColumns(forcedColumnCount)
      : { flexClass: GALLERY_FLEX_CLASS, itemClass: GALLERY_ITEM_CLASS }

  const columns = useMemo(
    () => distributeGalleryToColumns(images, columnCount),
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
        flexClass={flexClass}
        itemClass={itemClass}
      />
    )
  }

  return (
    <>
      <div className={`${flexClass} ${className}`}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={GALLERY_COLUMN_CLASS}>
            {column.map((image) => (
              <GalleryTile
                key={image.id}
                image={image}
                enableLightbox={enableLightbox}
                isOpening={openingId === image.id}
                openingBusy={Boolean(openingId)}
                onOpen={(next) => void openLightbox(next)}
                itemClassName={itemClass}
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
