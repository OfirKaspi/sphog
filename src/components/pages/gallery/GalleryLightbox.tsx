"use client"

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react"
import { ZoomIn, ZoomOut } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  galleryOptimizedSrc,
  type GalleryGridItem,
} from "@/components/pages/gallery/galleryImage"

const MIN_SCALE = 1
const MAX_SCALE = 4
const ZOOM_STEP = 0.35

type GalleryLightboxProps = {
  image: GalleryGridItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function GalleryLightbox({ image, open, onOpenChange }: GalleryLightboxProps) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const pinchStartDistance = useRef<number | null>(null)
  const pinchStartScale = useRef(1)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)

  const resetView = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
    setIsPanning(false)
    pinchStartDistance.current = null
    dragRef.current = null
  }, [])

  useEffect(() => {
    if (!open) {
      resetView()
      return
    }
    resetView()
  }, [open, image?.id, resetView])

  const clampScale = (value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value))

  const zoomBy = (delta: number) => {
    setScale((current) => {
      const next = clampScale(current + delta)
      if (next <= MIN_SCALE) {
        setOffset({ x: 0, y: 0 })
      }
      return next
    })
  }

  const onWheel = (event: React.WheelEvent) => {
    event.preventDefault()
    event.stopPropagation()
    zoomBy(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)
  }

  const touchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null
    const a = touches[0]
    const b = touches[1]
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
  }

  const onTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 2) {
      const distance = touchDistance(event.touches)
      pinchStartDistance.current = distance
      pinchStartScale.current = scale
      dragRef.current = null
    }
  }

  const onTouchMove = (event: React.TouchEvent) => {
    if (event.touches.length === 2 && pinchStartDistance.current) {
      event.preventDefault()
      const distance = touchDistance(event.touches)
      if (!distance) return
      const next = clampScale(pinchStartScale.current * (distance / pinchStartDistance.current))
      setScale(next)
      if (next <= MIN_SCALE) {
        setOffset({ x: 0, y: 0 })
      }
    }
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    if (event.touches.length < 2) {
      pinchStartDistance.current = null
    }
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (scale <= MIN_SCALE) return
    if ((event.target as HTMLElement).closest("button")) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsPanning(true)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    setOffset({
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    })
  }

  const onPointerUp = (event: React.PointerEvent) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
      setIsPanning(false)
    }
  }

  const toggleZoom = () => {
    if (scale > MIN_SCALE) {
      resetView()
      return
    }
    setScale(2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed inset-0 left-0 top-0 z-50 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center gap-0 border-0 bg-transparent p-0 shadow-none sm:rounded-none data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0 [&_button.absolute]:left-4 [&_button.absolute]:top-4 [&_button.absolute]:z-30 [&_button.absolute]:rounded-full [&_button.absolute]:bg-white [&_button.absolute]:p-2.5 [&_button.absolute]:opacity-100 [&_button.absolute]:shadow-lg [&_button.absolute]:hover:bg-white"
        dir="rtl"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogTitle className="sr-only">
          {image?.alt?.trim() || "תמונה מהגלריה"}
        </DialogTitle>

        {image ? (
          <div
            data-gallery-lightbox-stage
            className={`relative flex h-full w-full items-center justify-center overflow-visible touch-none ${
              scale > MIN_SCALE ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
            }`}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                onOpenChange(false)
              }
            }}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={(event) => {
              if ((event.target as HTMLElement).closest("button")) return
              toggleZoom()
            }}
          >
            <div className="flex max-h-full max-w-full flex-col items-center gap-5">
              <img
                src={galleryOptimizedSrc(image.src)}
                alt=""
                draggable={false}
                className="max-h-[78dvh] w-auto max-w-[min(92vw,56rem)] select-none rounded-xl object-contain"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isPanning ? "none" : "transform 120ms ease-out",
                }}
              />

              <div className="pointer-events-auto z-30 flex shrink-0 items-center gap-1 rounded-full bg-white/95 p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => zoomBy(-ZOOM_STEP)}
                  disabled={scale <= MIN_SCALE}
                  className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
                  aria-label="הקטן"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="min-w-12 text-center text-xs font-medium text-slate-600 tabular-nums">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => zoomBy(ZOOM_STEP)}
                  disabled={scale >= MAX_SCALE}
                  className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
                  aria-label="הגדל"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
