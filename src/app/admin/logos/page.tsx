"use client"

import type { CSSProperties } from "react"
import { Suspense, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Loader2, RefreshCw, Send, Trash2 } from "lucide-react"

import AdminShell from "@/components/admin/AdminShell"
import PrivateWorkshopLogosCarousel from "@/components/pages/private-workshops/PrivateWorkshopLogosCarousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAdminSession } from "@/hooks/useAdminSession"
import { useAppToast } from "@/hooks/useAppToast"
import { PRIVATE_WORKSHOP_LOGOS_HEADING } from "@/lib/constants/privateWorkshopLogos"
import { draftAndPublishedLogoRowsEqual } from "@/lib/privateWorkshopLogosCompare"
import type { Database } from "@/lib/supabase"

type AdminLogoRow = Database["public"]["Tables"]["private_workshop_logos"]["Row"]

function withNewSortOrder(logos: AdminLogoRow[]) {
  return logos.map((logo, index) => ({ ...logo, sort_order: index }))
}

function DraftListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-xl border bg-white p-3 animate-pulse">
          <div className="h-5 w-5 rounded bg-slate-200" />
          <div className="h-14 w-28 rounded-md bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 rounded bg-slate-200" />
            <div className="h-9 w-full rounded bg-slate-200" />
          </div>
          <div className="h-9 w-20 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  )
}

export default function AdminLogosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
        </div>
      }
    >
      <AdminLogosContent />
    </Suspense>
  )
}

function SortableLogoRow({
  logo,
  onAltBlur,
  onDelete,
  disabled,
}: {
  logo: AdminLogoRow
  onAltBlur: (id: string, value: string) => void
  onDelete: (id: string) => void
  disabled: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: logo.id })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-3">
      <button
        type="button"
        className="touch-none text-gray-500 hover:text-gray-800 p-1"
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="h-14 w-28 shrink-0 overflow-hidden rounded-md border bg-slate-50 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.image_url} alt="" className="max-h-12 w-auto object-contain" />
      </div>
      <div className="flex-1 min-w-[200px] space-y-1">
        <Label htmlFor={`alt-${logo.id}`}>טקסט חלופי (נגישות)</Label>
        <Input
          id={`alt-${logo.id}`}
          defaultValue={logo.image_alt}
          disabled={disabled}
          onBlur={(event) => onAltBlur(logo.id, event.target.value)}
          className="bg-white"
        />
      </div>
      <Button type="button" variant="outline" className="text-red-700 border-red-200" disabled={disabled} onClick={() => onDelete(logo.id)}>
        <Trash2 className="h-4 w-4 ms-1" />
        מחק
      </Button>
    </div>
  )
}

function AdminLogosContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const toast = useAppToast()
  const { isAuthenticated, isCheckingAuth, getAuthHeaders, signOut } = useAdminSession()

  const [logos, setLogos] = useState<AdminLogoRow[]>([])
  const [publishedRows, setPublishedRows] = useState<AdminLogoRow[]>([])
  const [carouselEnabled, setCarouselEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null)

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

  const loadLogos = async () => {
    setLoading(true)
    try {
      const headers = await getHeadersOrNotify()
      if (!headers) return
      const response = await fetch("/api/admin/logos", { headers })
      if (!response.ok) {
        toast.error("שגיאה בטעינת לוגואים")
        return
      }
      const body = (await response.json()) as {
        draft: AdminLogoRow[]
        published: AdminLogoRow[]
        carouselEnabled: boolean
      }
      setLogos(withNewSortOrder(body.draft))
      setPublishedRows(withNewSortOrder(body.published))
      setCarouselEnabled(body.carouselEnabled)
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בטעינת לוגואים")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return
    void loadLogos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const hasUnpublishedChanges = useMemo(
    () => !draftAndPublishedLogoRowsEqual(logos, publishedRows),
    [logos, publishedRows]
  )

  const draftPreviewItems = useMemo(
    () => logos.map((row) => ({ id: row.id, src: row.image_url, alt: row.image_alt || "לוגו" })),
    [logos]
  )

  const livePreviewItems = useMemo(
    () => publishedRows.map((row) => ({ id: row.id, src: row.image_url, alt: row.image_alt || "לוגו" })),
    [publishedRows]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )
  const sortableIds = logos.map((l) => l.id)

  const persistSortOrder = async (nextLogos: AdminLogoRow[]) => {
    setLogos(nextLogos)
    setReordering(true)
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) return
      const response = await fetch("/api/admin/logos/reorder", {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          items: nextLogos.map((item) => ({ id: item.id, sort_order: item.sort_order })),
        }),
      })
      if (!response.ok) {
        toast.error("שגיאה בעדכון סדר")
        await loadLogos()
        return
      }
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בעדכון סדר")
      await loadLogos()
    } finally {
      setReordering(false)
    }
  }

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = logos.findIndex((l) => l.id === active.id)
    const to = logos.findIndex((l) => l.id === over.id)
    if (from < 0 || to < 0) return
    const moved = withNewSortOrder(arrayMove(logos, from, to))
    await persistSortOrder(moved)
  }

  const onAltBlur = async (id: string, value: string) => {
    const original = logos.find((l) => l.id === id)
    if (!original || original.image_alt === value) return
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) return
      const response = await fetch(`/api/admin/logos/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ image_alt: value }),
      })
      if (!response.ok) {
        toast.error("שגיאה בשמירת טקסט חלופי")
        return
      }
      const updated = (await response.json()) as AdminLogoRow
      setLogos((prev) => prev.map((row) => (row.id === id ? updated : row)))
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בשמירה")
    }
  }

  const onDelete = async (id: string) => {
    if (deletePendingId) {
      return
    }
    if (!window.confirm("למחוק לוגו זה מהטיוטה? (יימחק מ-Cloudinary רק אם אינו בשימוש בפרסום)")) {
      return
    }
    setDeletePendingId(id)
    try {
      const headers = await getHeadersOrNotify()
      if (!headers) return
      const response = await fetch(`/api/admin/logos/${id}`, { method: "DELETE", headers })
      if (!response.ok) {
        toast.error("שגיאה במחיקה")
        return
      }
      setLogos((prev) => withNewSortOrder(prev.filter((l) => l.id !== id)))
      toast.success("נמחק")
    } catch (error) {
      console.error(error)
      toast.error("שגיאה במחיקה")
    } finally {
      setDeletePendingId(null)
    }
  }

  const onUpload = async (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("נא להעלות קובץ תמונה בלבד")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("הקובץ חייב להיות עד 5MB")
      return
    }
    setUploading(true)
    try {
      const headers = await getHeadersOrNotify()
      if (!headers) return
      const formData = new FormData()
      formData.set("image", file)
      const uploadRes = await fetch("/api/admin/logos/upload-image", { method: "POST", headers, body: formData })
      if (!uploadRes.ok) {
        toast.error("העלאה נכשלה")
        return
      }
      const { image_url, image_public_id } = (await uploadRes.json()) as { image_url: string; image_public_id: string }
      const jsonHeaders = await getHeadersOrNotify(true)
      if (!jsonHeaders) return
      const createRes = await fetch("/api/admin/logos", {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          image_url,
          image_public_id,
          image_alt: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " "),
        }),
      })
      if (!createRes.ok) {
        toast.error("שמירת הלוגו נכשלה")
        return
      }
      const created = (await createRes.json()) as AdminLogoRow
      setLogos((prev) => withNewSortOrder([created, ...prev]))
      toast.success("הלוגו נוסף לראש הטיוטה")
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בהעלאה")
    } finally {
      setUploading(false)
    }
  }

  const onPublish = async () => {
    setPublishing(true)
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) return
      const response = await fetch("/api/admin/logos/publish", { method: "POST", headers })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        toast.error((body as { error?: string })?.error || "פרסום נכשל")
        return
      }
      toast.success("פורסם לאתר")
      await loadLogos()
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בפרסום")
    } finally {
      setPublishing(false)
    }
  }

  const onCarouselEnabledChange = async (enabled: boolean) => {
    setSettingsSaving(true)
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) return
      const response = await fetch("/api/admin/logos/settings", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ carousel_enabled: enabled }),
      })
      if (!response.ok) {
        toast.error("שגיאה בעדכון הגדרות המקטע")
        return
      }
      setCarouselEnabled(enabled)
      toast.success(enabled ? "המקטע הופעל באתר" : "המקטע כובה באתר")
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
    <AdminShell title="ניהול לוגואים — סדנאות פרטיות" onLogout={signOut}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => void loadLogos()} disabled={loading} className="inline-flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            רענון
          </Button>
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white inline-flex items-center gap-2"
            onClick={() => void onPublish()}
            disabled={publishing || logos.length === 0}
            title={logos.length === 0 ? "אין לוגואים בטיוטה לפרסום" : undefined}
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            פרסם לאתר
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={carouselEnabled ? "default" : "secondary"}
            className={carouselEnabled ? "border-transparent bg-green-700 text-white hover:bg-green-700" : ""}
          >
            {carouselEnabled ? "המקטע מוצג באתר" : "המקטע מוסתר באתר"}
          </Badge>
          <Badge variant={hasUnpublishedChanges ? "destructive" : "outline"}>
            {hasUnpublishedChanges ? "יש שינויים בטיוטה שלא פורסמו" : "הטיוטה תואמת למה שפורסם"}
          </Badge>
        </div>

        <div className="rounded-xl border bg-white p-4 text-sm text-gray-700 space-y-3">
          <div className="flex flex-wrap items-start gap-4">
            <div dir="ltr" className="flex shrink-0 items-center pt-0.5">
              <Switch
                checked={carouselEnabled}
                disabled={settingsSaving || loading}
                onCheckedChange={(checked) => void onCarouselEnabledChange(checked)}
              />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-base font-medium text-foreground">הצג את מקטע לוגואי הלקוחות בדף סדנאות פרטיות</p>
              <p className="text-gray-600">
                כבוי — המבקרים לא יראו את הקרוסלה, גם אם יש לוגואים מפורסמים. ההגדרה חלה מיד על האתר.
              </p>
            </div>
          </div>
          <p className="font-medium pt-2 border-t">מצב פרסום</p>
          <p className="text-gray-600">
            זו טיוטה פנימית. האתר הציבורי מציג את גרסת הפרסום בלבד. חלוקה לשתי שורות בקרוסלה לפי סדר הרשימה: חצי עליון /
            חצי תחתון.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>טיוטה — עריכה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-2">
                <Label htmlFor="new-logo">הוספת לוגו</Label>
                <Input
                  id="new-logo"
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="bg-white max-w-xs"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null
                    event.target.value = ""
                    void onUpload(file)
                  }}
                />
              </div>
              {uploading ? (
                <span className="text-sm text-gray-600 inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> מעלה…
                </span>
              ) : null}
              {reordering ? (
                <span className="text-sm text-gray-600 inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> שומר סדר חדש…
                </span>
              ) : null}
            </div>

            {loading ? (
              <DraftListSkeleton />
            ) : logos.length === 0 ? (
              <p className="text-gray-600">אין לוגואים בטיוטה. אם יש קבצים ב־Cloudinary בתיקייה הנכונה, הם יוטענו אוטומטית בטעינת העמוד; אחרת ניתן להעלות תמונה כאן.</p>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => void onDragEnd(event)}>
                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {logos.map((logo) => (
                      <SortableLogoRow
                        key={logo.id}
                        logo={logo}
                        onAltBlur={onAltBlur}
                        onDelete={onDelete}
                        disabled={uploading || publishing || reordering || deletePendingId === logo.id}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>באתר החי עכשיו</CardTitle>
              <p className="text-sm text-muted-foreground">
                מה שמבקרים רואים בפועל: לוגואים מפורסמים {carouselEnabled ? "והמקטע מופעל" : "— והמקטע מכובה (הקרוסלה מוסתרת)"}.
              </p>
            </CardHeader>
            <CardContent className="rounded-xl border bg-slate-50 overflow-hidden min-h-[120px]">
              {!carouselEnabled ? (
                <p className="text-center text-gray-600 py-8 px-2">
                  המקטע כבוי — אף קרוסלה לא מוצגת בדף סדנאות פרטיות (גם אם יש לוגואים שפורסמו).
                </p>
              ) : livePreviewItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">אין לוגואים מפורסמים — המקטע ריק באתר.</p>
              ) : (
                <PrivateWorkshopLogosCarousel heading={PRIVATE_WORKSHOP_LOGOS_HEADING} logos={livePreviewItems} />
              )}
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>טיוטה — איך ייראה אחרי פרסום</CardTitle>
              <p className="text-sm text-muted-foreground">
                הכותרת קבועה בקוד. זהו סדר ותוכן הטיוטה; לחיצה על פרסום מעדכנת את מה שמוצג ב&quot;באתר החי&quot;.
              </p>
            </CardHeader>
            <CardContent className="rounded-xl border bg-slate-50 overflow-hidden min-h-[120px]">
              {draftPreviewItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">אין לוגואים בטיוטה</p>
              ) : (
                <PrivateWorkshopLogosCarousel heading={PRIVATE_WORKSHOP_LOGOS_HEADING} logos={draftPreviewItems} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
