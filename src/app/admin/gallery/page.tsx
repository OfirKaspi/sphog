"use client"

import type { CSSProperties, ReactNode } from "react"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
  type AnimateLayoutChanges,
} from "@dnd-kit/sortable"
import {
  AlertCircle,
  GripVertical,
  Loader2,
  Monitor,
  RefreshCw,
  Send,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react"

import AdminShell from "@/components/admin/AdminShell"
import GalleryGrid, {
  GALLERY_COLUMN_CLASS,
  GALLERY_ITEM_CLASS,
  GALLERY_VIEWPORT_PRESETS,
  GalleryGridSkeleton,
  distributeGalleryToColumns,
  galleryOptimizedSrc,
  type GalleryViewportPreset,
} from "@/components/pages/gallery/GalleryGrid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAdminSession } from "@/hooks/useAdminSession"
import { useAppToast } from "@/hooks/useAppToast"
import { GALLERY_PAGE_TITLE } from "@/lib/constants/gallery"
import { draftAndPublishedGalleryRowsEqual, dedupeGalleryImagesByAsset } from "@/lib/galleryCompare"
import type { Database } from "@/lib/supabase"

type AdminGalleryRow = Database["public"]["Tables"]["gallery_images"]["Row"]

async function galleryResponseErrorMessage(response: Response): Promise<string> {
  let text = ""
  try {
    text = await response.text()
  } catch {
    return `שגיאה בטעינת הגלריה (${response.status})`
  }
  if (text) {
    try {
      const data = JSON.parse(text) as { error?: unknown }
      if (typeof data.error === "string" && data.error.trim()) {
        return data.error.trim()
      }
    } catch {
      /* not JSON */
    }
  }
  return `שגיאה בטעינת הגלריה (${response.status})`
}

function withNewSortOrder(images: AdminGalleryRow[]) {
  return images.map((image, index) => ({ ...image, sort_order: index }))
}

function toDedupedPreviewItems(rows: AdminGalleryRow[]) {
  return dedupeGalleryImagesByAsset(
    rows.map((row) => ({
      id: row.id,
      src: row.image_url,
      alt: row.image_alt || "תמונה מהגלריה",
      image_public_id: row.image_public_id,
    }))
  ).map(({ id, src, alt }) => ({ id, src, alt }))
}

function PreviewCardHeaderSkeleton() {
  return (
    <div className="space-y-2 animate-pulse pb-1" aria-hidden>
      <div className="h-6 w-48 rounded bg-slate-200" />
      <div className="h-4 w-full max-w-md rounded bg-slate-200" />
    </div>
  )
}

function PublishedGridSkeleton({
  columnCount,
  flexClass,
  itemClass,
}: {
  columnCount: number
  flexClass: string
  itemClass: string
}) {
  return (
    <div className="animate-pulse" aria-busy="true">
      <div className="mx-auto mb-4 h-7 w-28 rounded bg-slate-200" />
      <GalleryGridSkeleton
        count={8}
        columnCount={columnCount}
        flexClass={flexClass}
        itemClass={itemClass}
      />
    </div>
  )
}

/** Prefer pointer target; fall back to closest center for gaps between tiles. */
const galleryCollisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args)
  if (pointerHits.length > 0) {
    return pointerHits
  }
  return closestCenter(args)
}

/** Disable FLIP animations — live DOM reorder + DragOverlay keep gaps stable. */
const animateLayoutChanges: AnimateLayoutChanges = () => false

export default function AdminGalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
        </div>
      }
    >
      <AdminGalleryContent />
    </Suspense>
  )
}

function GalleryViewportTabs({
  value,
  onChange,
}: {
  value: GalleryViewportPreset
  onChange: (next: GalleryViewportPreset) => void
}) {
  const tabs: Array<{ id: GalleryViewportPreset; icon: typeof Smartphone }> = [
    { id: "mobile", icon: Smartphone },
    { id: "tablet", icon: Tablet },
    { id: "desktop", icon: Monitor },
  ]

  return (
    <div
      role="tablist"
      aria-label="תצוגת viewport"
      className="inline-flex flex-wrap items-center gap-1 rounded-lg border bg-slate-50 p-1"
    >
      {tabs.map(({ id, icon: Icon }) => {
        const active = value === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition ${
              active
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {GALLERY_VIEWPORT_PRESETS[id].labelHe}
          </button>
        )
      })}
    </div>
  )
}

/** Fixed-width canvas so column count matches the public breakpoint for that preset. */
function GalleryViewportCanvas({
  preset,
  children,
}: {
  preset: GalleryViewportPreset
  children: ReactNode
}) {
  const { previewWidth } = GALLERY_VIEWPORT_PRESETS[preset]
  return (
    <div className="overflow-x-auto">
      <div
        className="mx-auto rounded-xl border bg-slate-50/80 p-3 transition-[width] duration-200"
        style={{ width: previewWidth }}
      >
        {children}
      </div>
    </div>
  )
}

function SortableGalleryCard({
  image,
  onAltBlur,
  onDelete,
  disabled,
  itemClassName = GALLERY_ITEM_CLASS,
}: {
  image: AdminGalleryRow
  onAltBlur: (id: string, value: string) => void
  onDelete: (id: string) => void
  disabled: boolean
  itemClassName?: string
}) {
  const { attributes, listeners, setNodeRef, isDragging, isOver } = useSortable({
    id: image.id,
    animateLayoutChanges,
  })

  // Layout reflows via live arrayMove — no transforms (those break gap/ratio fidelity).
  const style: CSSProperties = {
    opacity: isDragging ? 0 : 1,
    zIndex: isOver && !isDragging ? 1 : undefined,
  }

  return (
    <figure
      ref={setNodeRef}
      style={style}
      className={`${itemClassName} group relative ${
        isOver && !isDragging ? "ring-2 ring-primary ring-offset-1 rounded-xl" : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={galleryOptimizedSrc(image.image_url)}
        alt={image.image_alt || ""}
        className="w-full h-auto rounded-xl select-none"
        draggable={false}
      />

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 group-hover:ring-primary/40 transition" />

      <div className="absolute top-1 inset-x-1 flex items-start justify-between gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          type="button"
          className="pointer-events-auto touch-none rounded-md bg-white/95 text-gray-700 shadow p-1 hover:bg-white disabled:opacity-50 cursor-grab active:cursor-grabbing"
          disabled={disabled}
          aria-label="גרור לשינוי סדר"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="pointer-events-auto bg-white/95 text-red-700 border-red-200 shadow h-7 px-2 text-xs"
          disabled={disabled}
          onClick={() => onDelete(image.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="absolute bottom-1 inset-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <Label htmlFor={`alt-${image.id}`} className="sr-only">
          טקסט חלופי
        </Label>
        <Input
          id={`alt-${image.id}`}
          defaultValue={image.image_alt}
          disabled={disabled || isDragging}
          onBlur={(event) => onAltBlur(image.id, event.target.value)}
          placeholder="טקסט חלופי"
          className="pointer-events-auto bg-white/95 shadow text-xs h-7 px-2"
        />
      </div>
    </figure>
  )
}

function GalleryDragOverlayCard({ image }: { image: AdminGalleryRow }) {
  return (
    <figure className="relative w-[min(140px,36vw)] cursor-grabbing shadow-2xl rounded-lg overflow-hidden ring-2 ring-primary/60 scale-105">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={galleryOptimizedSrc(image.image_url, 320)}
        alt={image.image_alt || ""}
        className="w-full h-auto rounded-lg"
        draggable={false}
      />
    </figure>
  )
}

function AdminGalleryContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const toast = useAppToast()
  const { isAuthenticated, isCheckingAuth, getAuthHeaders, signOut } = useAdminSession()

  const [images, setImages] = useState<AdminGalleryRow[]>([])
  const [publishedRows, setPublishedRows] = useState<AdminGalleryRow[]>([])
  const [galleryEnabled, setGalleryEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [successfulHydration, setSuccessfulHydration] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(
    null
  )
  const [publishing, setPublishing] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const imagesRef = useRef<AdminGalleryRow[]>([])
  const dragStartOrderRef = useRef<AdminGalleryRow[] | null>(null)
  const dragChangedRef = useRef(false)

  imagesRef.current = images

  const getHeadersOrNotify = async (isJson = false) => {
    const headers = await getAuthHeaders(isJson)
    if (headers) {
      return headers
    }
    toast.error("פג תוקף ההתחברות, יש להתחבר מחדש")
    const redirect = encodeURIComponent(`${pathname}?${searchParams.toString()}`)
    router.replace(`/admin?redirect=${redirect}`)
    return null
  }

  useEffect(() => {
    if (isCheckingAuth || isAuthenticated) {
      return
    }
    const redirect = encodeURIComponent(`${pathname}?${searchParams.toString()}`)
    router.replace(`/admin?redirect=${redirect}`)
  }, [isCheckingAuth, isAuthenticated, pathname, router, searchParams])

  const loadGallery = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const headers = await getHeadersOrNotify()
      if (!headers) return
      const response = await fetch("/api/admin/gallery", { headers })
      if (!response.ok) {
        const message = await galleryResponseErrorMessage(response)
        setLoadError(message)
        toast.error("שגיאה בטעינת הגלריה")
        return
      }
      const body = (await response.json()) as {
        draft: AdminGalleryRow[]
        published: AdminGalleryRow[]
        galleryEnabled: boolean
        hasUnpublishedChanges: boolean
      }
      setImages(withNewSortOrder(body.draft))
      setPublishedRows(withNewSortOrder(body.published))
      setGalleryEnabled(body.galleryEnabled)
      setSuccessfulHydration(true)
      setLoadError(null)
    } catch (error) {
      console.error(error)
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as Error).message === "string"
          ? (error as Error).message
          : "שגיאת רשת או תגובה לא תקינה"
      setLoadError(message)
      toast.error("שגיאה בטעינת הגלריה")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setSuccessfulHydration(false)
      setLoadError(null)
      setImages([])
      setPublishedRows([])
      setGalleryEnabled(true)
      return
    }
    void loadGallery()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const hasUnpublishedChanges = useMemo(
    () => !draftAndPublishedGalleryRowsEqual(images, publishedRows),
    [images, publishedRows]
  )

  const awaitingFirstHydration = isAuthenticated && !successfulHydration
  const showBootstrapSkeleton = awaitingFirstHydration && (loading || loadError === null)
  const showBootstrapError = awaitingFirstHydration && loadError !== null && !loading
  const showStaleDataLoadBanner = Boolean(successfulHydration && loadError && !loading)
  const showHydrationPlaceholder = showBootstrapSkeleton
  const showDraftGridSkeleton = showHydrationPlaceholder || (loading && images.length === 0)
  const showPublishedPreviewSkeleton =
    showHydrationPlaceholder || publishing || (loading && publishedRows.length === 0)

  const [viewportPreset, setViewportPreset] = useState<GalleryViewportPreset>("desktop")
  const viewport = GALLERY_VIEWPORT_PRESETS[viewportPreset]
  const columnCount = viewport.columns
  const draftColumns = useMemo(
    () => distributeGalleryToColumns(images, columnCount),
    [images, columnCount]
  )

  const livePreviewItems = useMemo(() => toDedupedPreviewItems(publishedRows), [publishedRows])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    })
  )
  const sortableIds = images.map((image) => image.id)

  const persistSortOrder = async (nextImages: AdminGalleryRow[]) => {
    setImages(nextImages)
    imagesRef.current = nextImages
    setReordering(true)
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) return
      const response = await fetch("/api/admin/gallery/reorder", {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          items: nextImages.map((item) => ({ id: item.id, sort_order: item.sort_order })),
        }),
      })
      if (!response.ok) {
        toast.error("שגיאה בעדכון סדר")
        await loadGallery()
        return
      }
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בעדכון סדר")
      await loadGallery()
    } finally {
      setReordering(false)
    }
  }

  const activeDragImage = useMemo(() => {
    if (!activeDragId) return null
    return (
      images.find((image) => image.id === activeDragId) ??
      dragStartOrderRef.current?.find((image) => image.id === activeDragId) ??
      null
    )
  }, [activeDragId, images])

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveDragId(String(active.id))
    dragStartOrderRef.current = imagesRef.current
    dragChangedRef.current = false
  }

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return

    setImages((items) => {
      const from = items.findIndex((image) => image.id === active.id)
      const to = items.findIndex((image) => image.id === over.id)
      if (from < 0 || to < 0 || from === to) {
        return items
      }
      dragChangedRef.current = true
      const moved = withNewSortOrder(arrayMove(items, from, to))
      imagesRef.current = moved
      return moved
    })
  }

  const onDragCancel = () => {
    setActiveDragId(null)
    if (dragStartOrderRef.current) {
      setImages(dragStartOrderRef.current)
      imagesRef.current = dragStartOrderRef.current
    }
    dragStartOrderRef.current = null
    dragChangedRef.current = false
  }

  const onDragEnd = async (_event: DragEndEvent) => {
    setActiveDragId(null)
    const start = dragStartOrderRef.current
    const changed = dragChangedRef.current
    dragStartOrderRef.current = null
    dragChangedRef.current = false

    if (!changed || !start) {
      return
    }

    const next = withNewSortOrder(imagesRef.current)
    const startSignature = start.map((row) => row.id).join(",")
    const nextSignature = next.map((row) => row.id).join(",")
    if (startSignature === nextSignature) {
      return
    }

    await persistSortOrder(next)
  }

  const onAltBlur = async (id: string, value: string) => {
    const original = images.find((image) => image.id === id)
    if (!original || original.image_alt === value) return
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) return
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ image_alt: value }),
      })
      if (!response.ok) {
        toast.error("שגיאה בשמירת טקסט חלופי")
        return
      }
      const updated = (await response.json()) as AdminGalleryRow
      setImages((prev) => prev.map((row) => (row.id === id ? updated : row)))
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בשמירה")
    }
  }

  const onDelete = async (id: string) => {
    if (deletePendingId) {
      return
    }
    if (!window.confirm("למחוק תמונה זו מהטיוטה? (תימחק מ-Cloudinary רק אם אינה בשימוש בפרסום)")) {
      return
    }
    setDeletePendingId(id)
    try {
      const headers = await getHeadersOrNotify()
      if (!headers) return
      const response = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE", headers })
      if (!response.ok) {
        toast.error("שגיאה במחיקה")
        return
      }
      setImages((prev) => withNewSortOrder(prev.filter((image) => image.id !== id)))
      toast.success("נמחק")
    } catch (error) {
      console.error(error)
      toast.error("שגיאה במחיקה")
    } finally {
      setDeletePendingId(null)
    }
  }

  const MAX_GALLERY_IMAGE_BYTES = 10 * 1024 * 1024

  const uploadSingleFile = async (file: File): Promise<AdminGalleryRow | null> => {
    if (!file.type.startsWith("image/")) {
      toast.error(`${file.name}: נא להעלות קובץ תמונה בלבד`)
      return null
    }
    if (file.size > MAX_GALLERY_IMAGE_BYTES) {
      toast.error(`${file.name}: הקובץ חייב להיות עד 10MB`)
      return null
    }

    const headers = await getHeadersOrNotify()
    if (!headers) return null
    const formData = new FormData()
    formData.set("image", file)
    const uploadRes = await fetch("/api/admin/gallery/upload-image", {
      method: "POST",
      headers,
      body: formData,
    })
    if (!uploadRes.ok) {
      const body = (await uploadRes.json().catch(() => null)) as { error?: string } | null
      toast.error(body?.error || `העלאה נכשלה: ${file.name}`)
      return null
    }
    const { image_url, image_public_id } = (await uploadRes.json()) as {
      image_url: string
      image_public_id: string
    }

    const discardUploadedAsset = async () => {
      try {
        const discardHeaders = await getHeadersOrNotify(true)
        if (!discardHeaders) return
        await fetch("/api/admin/gallery/upload-image", {
          method: "DELETE",
          headers: discardHeaders,
          body: JSON.stringify({ image_public_id }),
        })
      } catch (error) {
        console.error("Failed to discard orphaned Cloudinary gallery upload:", image_public_id, error)
      }
    }

    const jsonHeaders = await getHeadersOrNotify(true)
    if (!jsonHeaders) {
      await discardUploadedAsset()
      return null
    }
    const createRes = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        image_url,
        image_public_id,
        image_alt: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " "),
      }),
    })
    if (!createRes.ok) {
      const body = (await createRes.json().catch(() => null)) as { error?: string } | null
      // Server cleans up on duplicate / insert failure; still attempt discard for
      // transport failures where the create handler never ran.
      await discardUploadedAsset()
      toast.error(body?.error || `שמירת התמונה נכשלה: ${file.name}`)
      return null
    }
    return (await createRes.json()) as AdminGalleryRow
  }

  const onUpload = async (files: File[]) => {
    if (files.length === 0) {
      toast.error("לא נבחרו קבצים להעלאה")
      return
    }

    setUploading(true)
    setUploadProgress({ current: 0, total: files.length })
    try {
      // Process in selection order so each create appends and order is preserved.
      const createdRows: AdminGalleryRow[] = []
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        setUploadProgress({ current: index + 1, total: files.length })
        const created = await uploadSingleFile(file)
        if (created) {
          createdRows.push(created)
          // Show each successful upload immediately at the end
          setImages((prev) =>
            withNewSortOrder([...prev.filter((row) => row.id !== created.id), created])
          )
        }
      }

      if (createdRows.length > 0) {
        toast.success(
          createdRows.length === 1
            ? "התמונה נוספה לסוף הטיוטה"
            : `${createdRows.length} מתוך ${files.length} תמונות נוספו לטיוטה`
        )
      } else {
        toast.error("אף תמונה לא הועלתה")
      }
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בהעלאה")
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }

  const onPublish = async () => {
    setPublishing(true)
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) return
      const response = await fetch("/api/admin/gallery/publish", { method: "POST", headers })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        toast.error((body as { error?: string })?.error || "פרסום נכשל")
        return
      }
      const body = (await response.json()) as { revalidated?: boolean }
      toast.success("פורסם לאתר")
      if (body.revalidated === false) {
        toast.error("הפרסום נשמר אך ייתכן שהאתר יתעדכן בעיכוב — נסו לרענן את הדף")
      }
      await loadGallery()
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בפרסום")
    } finally {
      setPublishing(false)
    }
  }

  const onGalleryEnabledChange = async (enabled: boolean) => {
    setSettingsSaving(true)
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) return
      const response = await fetch("/api/admin/gallery/settings", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ gallery_enabled: enabled }),
      })
      if (!response.ok) {
        toast.error("שגיאה בעדכון הגדרות הגלריה")
        return
      }
      setGalleryEnabled(enabled)
      toast.success(enabled ? "הגלריה הופעלה באתר" : "הגלריה כובתה באתר")
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בעדכון הגדרות")
    } finally {
      setSettingsSaving(false)
    }
  }

  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <AdminShell title="ניהול גלריה" onLogout={signOut}>
      {showBootstrapError ? (
        <Card role="alert" className="border-red-300 bg-red-50/90">
          <CardHeader className="flex flex-row items-start gap-2 space-y-0">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-700 mt-0.5" aria-hidden />
            <div>
              <CardTitle className="text-lg text-red-900">שגיאה בטעינת הגלריה</CardTitle>
              <p className="text-sm text-red-900/85 pt-2">לא הצלחנו לטעון את הטיוטה והפרסום מהשרת.</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono break-words text-red-950 bg-white/70 rounded-md border border-red-200 p-3 mb-4">
              {loadError}
            </p>
            <Button
              type="button"
              onClick={() => void loadGallery()}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              נסה שוב
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {showStaleDataLoadBanner ? (
            <div
              role="alert"
              className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 flex flex-wrap items-start justify-between gap-3"
            >
              <div className="flex gap-2 min-w-0">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-800 mt-0.5" aria-hidden />
                <div className="min-w-0">
                  <p className="font-medium text-amber-950">לא ניתן לרענן את הנתונים מהשרת</p>
                  <p className="text-amber-900/95 mt-1 break-words">{loadError}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void loadGallery()}
                disabled={loading}
                className="shrink-0 border-amber-400"
              >
                רענון נתונים
              </Button>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadGallery()}
              disabled={loading}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              רענון
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white inline-flex items-center gap-2"
              onClick={() => void onPublish()}
              disabled={publishing || images.length === 0}
            >
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              פרסם לאתר
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={galleryEnabled ? "default" : "secondary"}
              className={galleryEnabled ? "border-transparent bg-green-700 text-white hover:bg-green-700" : ""}
            >
              {galleryEnabled ? "הגלריה מוצגת באתר" : "הגלריה מוסתרת באתר"}
            </Badge>
            <Badge variant={hasUnpublishedChanges ? "destructive" : "outline"}>
              {hasUnpublishedChanges ? "יש שינויים בטיוטה שלא פורסמו" : "הטיוטה תואמת למה שפורסם"}
            </Badge>
          </div>

          <div className="rounded-xl border bg-white p-4 text-sm text-gray-700 space-y-3">
            <div className="flex flex-wrap items-start gap-4">
              <div dir="ltr" className="flex shrink-0 items-center pt-0.5">
                <Switch
                  checked={galleryEnabled}
                  disabled={settingsSaving || loading}
                  onCheckedChange={(checked) => void onGalleryEnabledChange(checked)}
                />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-base font-medium text-foreground">הצג את דף הגלריה באתר</p>
                <p className="text-gray-600">
                  כבוי — קישור הגלריה מוסתר מהתפריט והדף לא נגיש, גם אם יש תמונות מפורסמות. ההגדרה חלה מיד.
                </p>
              </div>
            </div>
            <p className="font-medium pt-2 border-t">מצב פרסום</p>
            <p className="text-gray-600">
              זו טיוטה פנימית. האתר הציבורי מציג את גרסת הפרסום בלבד. ניתן לגרור תמונות לסידור מחדש ברשת.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>טיוטה — עריכה</CardTitle>
              <p className="text-sm text-muted-foreground">
                זה מה שיפורסם לאתר אחרי לחיצה על &quot;פרסם לאתר&quot;. הפריסה זהה לדף הגלריה.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="new-gallery-image">הוספת תמונות (ניתן לבחור כמה)</Label>
                    <Input
                      id="new-gallery-image"
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploading || loading}
                      className="bg-white max-w-xs"
                      onChange={(event) => {
                        // Snapshot before clearing — FileList is live and empties with value=""
                        const files = Array.from(event.target.files ?? [])
                        event.target.value = ""
                        void onUpload(files)
                      }}
                    />
                    <p className="text-xs text-muted-foreground">עד 10MB לתמונה · אפשר לבחור כמה יחד</p>
                  </div>
                  {uploading ? (
                    <span className="text-sm text-gray-600 inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {uploadProgress
                        ? `מעלה ${uploadProgress.current} מתוך ${uploadProgress.total}…`
                        : "מעלה תמונות…"}
                    </span>
                  ) : null}
                  {reordering ? (
                    <span className="text-sm text-gray-600 inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> שומר סדר חדש…
                    </span>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">תצוגת מסך</p>
                  <GalleryViewportTabs value={viewportPreset} onChange={setViewportPreset} />
                </div>
              </div>

              <GalleryViewportCanvas preset={viewportPreset}>
                {showDraftGridSkeleton ? (
                  <GalleryGridSkeleton
                    count={8}
                    columnCount={columnCount}
                    flexClass={viewport.flexClass}
                    itemClass={viewport.itemClass}
                  />
                ) : images.length === 0 ? (
                  <p className="text-gray-600">
                    אין תמונות בטיוטה. ניתן להעלות תמונות כאן (תיקיית Cloudinary: sphog/gallery).
                  </p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={galleryCollisionDetection}
                    measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragCancel={onDragCancel}
                    onDragEnd={(event) => void onDragEnd(event)}
                  >
                    <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
                      <div className={viewport.flexClass}>
                        {draftColumns.map((column, columnIndex) => (
                          <div key={columnIndex} className={GALLERY_COLUMN_CLASS}>
                            {column.map((image) => (
                              <SortableGalleryCard
                                key={image.id}
                                image={image}
                                onAltBlur={onAltBlur}
                                onDelete={onDelete}
                                itemClassName={viewport.itemClass}
                                disabled={
                                  uploading ||
                                  publishing ||
                                  reordering ||
                                  deletePendingId === image.id ||
                                  Boolean(activeDragId)
                                }
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </SortableContext>
                    <DragOverlay adjustScale={false} dropAnimation={null}>
                      {activeDragImage ? <GalleryDragOverlayCard image={activeDragImage} /> : null}
                    </DragOverlay>
                  </DndContext>
                )}
              </GalleryViewportCanvas>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader>
              {showPublishedPreviewSkeleton ? (
                <PreviewCardHeaderSkeleton />
              ) : (
                <>
                  <CardTitle>באתר החי עכשיו</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    מה שמבקרים רואים: תמונות מפורסמות{" "}
                    {galleryEnabled ? "והגלריה מופעלת" : "— והגלריה מכובה (הדף מוסתר)"}.
                  </p>
                </>
              )}
            </CardHeader>
            <CardContent className="min-h-[120px] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">אותה תצוגת מסך כמו בעריכת הטיוטה</p>
                <GalleryViewportTabs value={viewportPreset} onChange={setViewportPreset} />
              </div>
              <GalleryViewportCanvas preset={viewportPreset}>
                {showPublishedPreviewSkeleton ? (
                  <PublishedGridSkeleton
                    columnCount={columnCount}
                    flexClass={viewport.flexClass}
                    itemClass={viewport.itemClass}
                  />
                ) : !galleryEnabled ? (
                  <p className="text-center text-gray-600 py-8 px-2">
                    הגלריה כבויה — הדף והקישור בתפריט מוסתרים.
                  </p>
                ) : livePreviewItems.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">אין תמונות מפורסמות — הגלריה ריקה באתר.</p>
                ) : (
                  <div>
                    <h3 className="text-center text-xl font-bold text-primary mb-4">{GALLERY_PAGE_TITLE}</h3>
                    <GalleryGrid
                      images={livePreviewItems}
                      enableLightbox={false}
                      forcedColumnCount={columnCount}
                    />
                  </div>
                )}
              </GalleryViewportCanvas>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminShell>
  )
}
