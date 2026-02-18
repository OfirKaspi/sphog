"use client"

import { CSSProperties, Suspense, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Loader2, RefreshCw, Trash2 } from "lucide-react"

import AdminShell from "@/components/admin/AdminShell"
import OptimizedImage from "@/components/common/OptimizedImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAdminSession } from "@/hooks/useAdminSession"
import { useAppToast } from "@/hooks/useAppToast"
import { buildCatalogImageAlt, buildCatalogSlug } from "@/lib/catalogMetadata"
import type { Database } from "@/lib/supabase"

type AdminCatalogProduct = Database["public"]["Tables"]["catalog_products"]["Row"]
type CatalogTab = "regular" | "discount" | "home" | "archive"
type FormErrorKey = "name" | "price" | "original_price" | "image_url" | "locations" | "general"

type GalleryImageEntry = { url: string; public_id: string }

type CatalogFormState = {
  id?: string
  slug: string
  name: string
  description: string
  price: string
  original_price: string
  image_url: string
  image_public_id: string
  image_alt: string
  gallery_images: GalleryImageEntry[]
  in_stock: boolean
  show_on_home: boolean
  show_in_regular: boolean
  show_in_discount: boolean
  is_hidden: boolean
  is_active: boolean
  sort_order: string
}

const EMPTY_CATALOG_FORM: CatalogFormState = {
  slug: "",
  name: "",
  description: "",
  price: "",
  original_price: "",
  image_url: "",
  image_public_id: "",
  image_alt: "",
  gallery_images: [],
  in_stock: true,
  show_on_home: false,
  show_in_regular: true,
  show_in_discount: false,
  is_hidden: false,
  is_active: true,
  sort_order: "",
}

const TABS: Array<{ id: CatalogTab; label: string }> = [
  { id: "regular", label: "רגיל" },
  { id: "discount", label: "מבצעים" },
  { id: "home", label: "דף הבית" },
  { id: "archive", label: "ארכיון" },
]

function inTab(product: AdminCatalogProduct, tab: CatalogTab) {
  if (tab === "regular") return Boolean(product.show_in_regular)
  if (tab === "discount") return Boolean(product.show_in_discount)
  if (tab === "home") return Boolean(product.show_on_home)
  return Boolean(product.is_hidden || !product.is_active)
}

function withNewSortOrder(products: AdminCatalogProduct[]) {
  return products.map((product, index) => ({ ...product, sort_order: index }))
}

function getPlacementCount(product: AdminCatalogProduct) {
  return [product.show_in_regular, product.show_in_discount, product.show_on_home].filter(Boolean).length
}

export default function AdminCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
        </div>
      }
    >
      <AdminCatalogContent />
    </Suspense>
  )
}

function AdminCatalogContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const toast = useAppToast()
  const { isAuthenticated, isCheckingAuth, getAuthHeaders, signOut } = useAdminSession()

  const [products, setProducts] = useState<AdminCatalogProduct[]>([])
  const [activeTab, setActiveTab] = useState<CatalogTab>((searchParams.get("tab") as CatalogTab) || "regular")
  const [catalogForm, setCatalogForm] = useState<CatalogFormState>(EMPTY_CATALOG_FORM)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormErrorKey, string>>>({})
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [savingCatalog, setSavingCatalog] = useState(false)
  const [uploadingCatalogImage, setUploadingCatalogImage] = useState(false)
  const [catalogImageFile, setCatalogImageFile] = useState<File | null>(null)
  const [catalogImagePreview, setCatalogImagePreview] = useState("")
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

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
    if (isCheckingAuth || isAuthenticated) return
    const redirect = encodeURIComponent(`${pathname}?${searchParams.toString()}`)
    router.replace(`/admin?redirect=${redirect}`)
  }, [isAuthenticated, isCheckingAuth, pathname, router, searchParams])

  useEffect(() => {
    if (!isAuthenticated) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", activeTab)
    router.replace(`/admin/catalog?${params.toString()}`, { scroll: false })
  }, [activeTab, isAuthenticated, router, searchParams])

  useEffect(() => {
    return () => {
      if (catalogImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(catalogImagePreview)
      }
    }
  }, [catalogImagePreview])

  const loadCatalog = async () => {
    setLoadingCatalog(true)
    try {
      const headers = await getHeadersOrNotify()
      if (!headers) return
      const response = await fetch("/api/admin/catalog/products", { headers })
      if (!response.ok) {
        toast.error("שגיאה בטעינת קטלוג")
        return
      }
      const nextProducts = (await response.json()) as AdminCatalogProduct[]
      setProducts((prev) => {
        const prevKey = JSON.stringify(prev.map((item) => [item.id, item.updated_at, item.sort_order]))
        const nextKey = JSON.stringify(nextProducts.map((item) => [item.id, item.updated_at, item.sort_order]))
        return prevKey === nextKey ? prev : nextProducts
      })
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בטעינת קטלוג")
    } finally {
      setLoadingCatalog(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return
    void loadCatalog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const editedProduct = catalogForm.id ? products.find((product) => product.id === catalogForm.id) : null
  const filteredProducts = useMemo(() => products.filter((product) => inTab(product, activeTab)), [activeTab, products])
  const sortableIds = filteredProducts.map((product) => product.id)
  const previewSrc = catalogImagePreview || catalogForm.image_url
  const formFieldClassName = "bg-white"

  const validationErrors = useMemo(() => {
    const errors: Partial<Record<FormErrorKey, string>> = {}
    const parsedPrice = Number(catalogForm.price)
    const parsedOriginalPrice = catalogForm.original_price ? Number(catalogForm.original_price) : null
    if (!catalogForm.name.trim()) errors.name = "שם המוצר הוא שדה חובה"
    if (!catalogForm.price.trim()) errors.price = "מחיר הוא שדה חובה"
    else if (!Number.isFinite(parsedPrice) || parsedPrice < 0) errors.price = "יש להזין מחיר תקין (0 ומעלה)"
    if (parsedOriginalPrice !== null && parsedOriginalPrice < parsedPrice) {
      errors.original_price = "מחיר מקורי חייב להיות שווה או גבוה מהמחיר"
    }
    if (!catalogForm.image_url && !catalogImageFile) errors.image_url = "יש להוסיף תמונה לפני שמירה"
    if (!catalogForm.show_in_regular && !catalogForm.show_in_discount && !catalogForm.show_on_home) {
      errors.locations = "יש לבחור לפחות מיקום אחד"
    }
    return errors
  }, [catalogForm, catalogImageFile])
  const isFormValid = Object.keys(validationErrors).length === 0

  const updateCatalogForm = <K extends keyof CatalogFormState>(key: K, value: CatalogFormState[K]) => {
    setCatalogForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => ({ ...prev, [key]: undefined, general: undefined, locations: undefined }))
  }

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ""))
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })

  const onCatalogImageSelected = async (file: File | null) => {
    if (catalogImagePreview.startsWith("blob:")) URL.revokeObjectURL(catalogImagePreview)
    setFieldErrors((prev) => ({ ...prev, image_url: undefined }))
    if (!file) {
      setCatalogImageFile(null)
      setCatalogImagePreview("")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("אפשר להעלות קבצי תמונה בלבד")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("גודל התמונה המקסימלי הוא 5MB")
      return
    }
    setCatalogImageFile(file)
    try {
      setCatalogImagePreview(await toBase64(file))
    } catch {
      setCatalogImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadCatalogImage = async (): Promise<{ image_url: string; image_public_id: string } | null> => {
    if (!catalogImageFile) return null
    const headers = await getHeadersOrNotify()
    if (!headers) return null
    setUploadingCatalogImage(true)
    try {
      const formData = new FormData()
      formData.append("image", catalogImageFile)
      const response = await fetch("/api/admin/catalog/upload-image", { method: "POST", headers, body: formData })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.image_url || !result?.image_public_id) {
        toast.error(result?.error || "שגיאה בהעלאת תמונה")
        return null
      }
      return { image_url: result.image_url as string, image_public_id: result.image_public_id as string }
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בהעלאת תמונה")
      return null
    } finally {
      setUploadingCatalogImage(false)
    }
  }

  const resetForm = () => {
    setCatalogForm(EMPTY_CATALOG_FORM)
    setCatalogImageFile(null)
    setCatalogImagePreview("")
    setGalleryFiles([])
    setGalleryPreviews([])
    setFieldErrors({})
    setIsEditDialogOpen(false)
  }

  const editProduct = (product: AdminCatalogProduct) => {
    const existingGallery: GalleryImageEntry[] = Array.isArray(product.gallery_images) ? product.gallery_images : []
    setCatalogForm({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      original_price: product.original_price === null ? "" : String(product.original_price),
      image_url: product.image_url,
      image_public_id: product.image_public_id ?? "",
      image_alt: product.image_alt ?? "",
      gallery_images: existingGallery,
      in_stock: product.in_stock,
      show_on_home: product.show_on_home,
      show_in_regular: product.show_in_regular ?? true,
      show_in_discount: product.show_in_discount ?? false,
      is_hidden: product.is_hidden ?? false,
      is_active: product.is_active,
      sort_order: String(product.sort_order),
    })
    setCatalogImageFile(null)
    setCatalogImagePreview(product.image_url)
    setGalleryFiles([])
    setGalleryPreviews(existingGallery.map((img) => img.url))
    setFieldErrors({})
    setIsEditDialogOpen(true)
  }

  const openNewProduct = () => {
    resetForm()
    setIsEditDialogOpen(true)
  }

  const applyServerErrors = async (response: Response) => {
    const result = await response.json().catch(() => null)
    const nextErrors: Partial<Record<FormErrorKey, string>> = {}
    if (result?.issues?.fieldErrors) {
      const map = result.issues.fieldErrors as Record<string, string[]>
      for (const [key, messages] of Object.entries(map)) {
        const first = messages?.[0]
        if (!first) continue
        if (key in EMPTY_CATALOG_FORM) nextErrors[key as FormErrorKey] = first
        else nextErrors.general = first
      }
    } else if (result?.error) {
      nextErrors.general = String(result.error)
    } else {
      nextErrors.general = "אירעה שגיאה בשמירת המוצר"
    }
    setFieldErrors(nextErrors)
    toast.error(nextErrors.general || "יש שגיאות בטופס")
  }

  const saveProduct = async () => {
    setFieldErrors(validationErrors)
    if (!isFormValid) {
      toast.error(validationErrors.general || "נא למלא את כל שדות החובה")
      return
    }
    setSavingCatalog(true)
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) return
      let imageData: { image_url: string; image_public_id: string } | null = null
      if (catalogImageFile) {
        imageData = await uploadCatalogImage()
        if (!imageData) return
      }

      const finalGalleryImages = [...catalogForm.gallery_images]
      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const uploadHeaders = await getHeadersOrNotify()
          if (!uploadHeaders) return
          const formData = new FormData()
          formData.append("image", file)
          const res = await fetch("/api/admin/catalog/upload-image", { method: "POST", headers: uploadHeaders, body: formData })
          const result = await res.json().catch(() => null)
          if (!res.ok || !result?.image_url || !result?.image_public_id) {
            toast.error(result?.error || "שגיאה בהעלאת תמונת גלריה")
            return
          }
          finalGalleryImages.push({ url: result.image_url, public_id: result.image_public_id })
        }
      }

      const payload = {
        slug: catalogForm.slug || buildCatalogSlug(catalogForm.name),
        name: catalogForm.name,
        description: catalogForm.description,
        price: Number(catalogForm.price),
        original_price: catalogForm.original_price ? Number(catalogForm.original_price) : null,
        image_url: imageData?.image_url ?? catalogForm.image_url,
        image_public_id: imageData?.image_public_id ?? catalogForm.image_public_id ?? null,
        image_alt: catalogForm.image_alt || buildCatalogImageAlt(catalogForm.name),
        gallery_images: finalGalleryImages.length > 0 ? finalGalleryImages : null,
        in_stock: catalogForm.in_stock,
        is_promo: catalogForm.show_in_discount,
        show_on_home: catalogForm.show_on_home,
        show_in_regular: catalogForm.show_in_regular,
        show_in_discount: catalogForm.show_in_discount,
        is_hidden: catalogForm.is_hidden,
        is_active: catalogForm.is_active,
        sort_order: catalogForm.id
          ? Number(catalogForm.sort_order || editedProduct?.sort_order || 0)
          : products.length,
      }
      const endpoint = catalogForm.id ? `/api/admin/catalog/products/${catalogForm.id}` : "/api/admin/catalog/products"
      const method = catalogForm.id ? "PATCH" : "POST"
      const response = await fetch(endpoint, { method, headers, body: JSON.stringify(payload) })
      if (!response.ok) {
        await applyServerErrors(response)
        return
      }
      resetForm()
      await loadCatalog()
      toast.success("המוצר נשמר בהצלחה")
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בשמירת מוצר")
    } finally {
      setSavingCatalog(false)
    }
  }

  const deleteProduct = async (id: string) => {
    const product = products.find((item) => item.id === id)
    if (!product) {
      toast.error("המוצר לא נמצא")
      return
    }

    const placementCount = getPlacementCount(product)
    const shouldDeletePermanently = activeTab === "archive" || placementCount <= 1

    if (shouldDeletePermanently) {
      if (!confirm("למחוק מוצר זה לחלוטין? התמונה תימחק גם מהענן.")) return
    } else if (!confirm("המוצר מוצג במספר אזורים. להסיר אותו רק מהלשונית הנוכחית?")) {
      return
    }

    try {
      const headers = await getHeadersOrNotify()
      if (!headers) return

      if (!shouldDeletePermanently) {
        const jsonHeaders = await getHeadersOrNotify(true)
        if (!jsonHeaders) return

        const removePayload: Record<string, unknown> =
          activeTab === "regular"
            ? { show_in_regular: false }
            : activeTab === "discount"
              ? { show_in_discount: false, is_promo: false }
              : { show_on_home: false }

        const patchResponse = await fetch(`/api/admin/catalog/products/${id}`, {
          method: "PATCH",
          headers: jsonHeaders,
          body: JSON.stringify(removePayload),
        })

        if (!patchResponse.ok) {
          const result = await patchResponse.json().catch(() => null)
          toast.error(result?.error || "שגיאה בהסרת מוצר מהלשונית")
          return
        }

        await loadCatalog()
        toast.success("המוצר הוסר מהלשונית הנוכחית בלבד")
        return
      }

      const response = await fetch(`/api/admin/catalog/products/${id}`, { method: "DELETE", headers })
      if (!response.ok) {
        const result = await response.json().catch(() => null)
        toast.error(result?.error || "שגיאה במחיקת מוצר")
        return
      }
      await loadCatalog()
      toast.success("המוצר נמחק לחלוטין")
    } catch (error) {
      console.error(error)
      toast.error("שגיאה במחיקת מוצר")
    }
  }

  const sensors = useSensors(useSensor(PointerSensor))
  const persistSortOrder = async (nextProducts: AdminCatalogProduct[]) => {
    setProducts(nextProducts)
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) return
      toast.info("שומר סדר חדש...", {
        duration: 1200,
        className: "border border-blue-300 text-blue-800",
      })
      const response = await fetch("/api/admin/catalog/products/reorder", {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          items: nextProducts.map((product) => ({ id: product.id, sort_order: product.sort_order })),
        }),
      })
      if (!response.ok) {
        const result = await response.json().catch(() => null)
        toast.error(result?.error || "שגיאה בעדכון סדר")
        await loadCatalog()
        return
      }
      toast.success("סדר המוצרים עודכן")
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בעדכון סדר")
      await loadCatalog()
    }
  }

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const subset = products.filter((product) => inTab(product, activeTab))
    const from = subset.findIndex((product) => product.id === active.id)
    const to = subset.findIndex((product) => product.id === over.id)
    if (from < 0 || to < 0) return
    const movedSubset = withNewSortOrder(arrayMove(subset, from, to))
    const movedMap = new Map(movedSubset.map((product) => [product.id, product.sort_order]))
    const merged = products.map((product) =>
      movedMap.has(product.id) ? { ...product, sort_order: movedMap.get(product.id)! } : product
    )
    await persistSortOrder(withNewSortOrder([...merged].sort((a, b) => a.sort_order - b.sort_order)))
  }

  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <AdminShell title="ניהול קטלוג" onLogout={signOut}>
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={activeTab !== tab.id ? "bg-white hover:bg-gray-50" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          <Button
            onClick={openNewProduct}
            className="bg-cta hover:bg-cta-foreground text-white font-bold"
          >
            + מוצר חדש
          </Button>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          {loadingCatalog ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto" />
              <p className="text-gray-600 mt-2">טוען נתונים...</p>
            </div>
          ) : null}
          {!loadingCatalog && filteredProducts.length === 0 ? <p className="text-gray-500">אין מוצרים בלשונית זו</p> : null}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => void onDragEnd(event)}>
            <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <SortableCatalogCard
                    key={product.id}
                    product={product}
                    onEdit={() => editProduct(product)}
                    onDelete={() => void deleteProduct(product.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => void loadCatalog()} variant="outline" className="inline-flex items-center gap-1"><RefreshCw className="w-4 h-4" /> רענון</Button>
          </div>
        </div>
      </section>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{catalogForm.id ? "עריכת מוצר" : "מוצר חדש"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="catalog-name">שם מוצר *</Label>
              <Input id="catalog-name" className={formFieldClassName} value={catalogForm.name} onChange={(event) => updateCatalogForm("name", event.target.value)} />
              {fieldErrors.name ? <p className="text-xs text-red-600">{fieldErrors.name}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-description">תיאור מוצר / הערה</Label>
              <Textarea id="catalog-description" className={formFieldClassName} value={catalogForm.description} onChange={(event) => updateCatalogForm("description", event.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="catalog-price">מחיר *</Label>
                <Input id="catalog-price" className={formFieldClassName} type="number" min={0} value={catalogForm.price} onChange={(event) => updateCatalogForm("price", event.target.value)} />
                {fieldErrors.price ? <p className="text-xs text-red-600">{fieldErrors.price}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="catalog-original-price">מחיר מקורי</Label>
                <Input id="catalog-original-price" className={formFieldClassName} type="number" min={0} value={catalogForm.original_price} onChange={(event) => updateCatalogForm("original_price", event.target.value)} />
                {fieldErrors.original_price ? <p className="text-xs text-red-600">{fieldErrors.original_price}</p> : null}
              </div>
            </div>
            <div className="rounded-xl border bg-slate-50 p-3 space-y-3">
              <Label htmlFor="catalog-image">תמונת מוצר (עד 5MB) *</Label>
              <Input id="catalog-image" type="file" accept="image/*" onChange={(event) => void onCatalogImageSelected(event.target.files?.[0] ?? null)} className={formFieldClassName} />
              {previewSrc ? (
                <div className="relative h-52 w-full overflow-hidden rounded-lg border bg-white">
                  <CatalogImage src={previewSrc} alt={catalogForm.name || "תצוגה מקדימה"} />
                </div>
              ) : (
                <p className="text-xs text-gray-500">אין תמונה שנבחרה עדיין.</p>
              )}
              {fieldErrors.image_url ? <p className="text-xs text-red-600">{fieldErrors.image_url}</p> : null}
            </div>
            <div className="rounded-xl border bg-slate-50 p-3 space-y-3">
              <Label htmlFor="gallery-images">תמונות נוספות לגלריה (עד 5MB כל אחת)</Label>
              <Input
                id="gallery-images"
                type="file"
                accept="image/*"
                multiple
                className={formFieldClassName}
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? [])
                  const valid = files.filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024)
                  if (valid.length < files.length) toast.error("חלק מהקבצים לא תקינים (לא תמונה או גדולים מ-5MB)")
                  if (valid.length === 0) return
                  setGalleryFiles((prev) => [...prev, ...valid])
                  void Promise.all(valid.map((f) => toBase64(f))).then((base64Urls) => {
                    setGalleryPreviews((prev) => [...prev, ...base64Urls])
                  })
                  event.target.value = ""
                }}
              />
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryPreviews.map((src, idx) => {
                    const isExisting = idx < catalogForm.gallery_images.length
                    return (
                      <div key={`${idx}-${src.slice(-20)}`} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border bg-white">
                          <CatalogImage src={src} alt={`גלריה ${idx + 1}`} />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (isExisting) {
                              setCatalogForm((prev) => ({
                                ...prev,
                                gallery_images: prev.gallery_images.filter((_, i) => i !== idx),
                              }))
                            } else {
                              const fileIdx = idx - catalogForm.gallery_images.length
                              setGalleryFiles((prev) => prev.filter((_, i) => i !== fileIdx))
                            }
                            setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx))
                          }}
                          className="absolute -top-1.5 -left-1.5 z-10 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs shadow"
                          aria-label="הסר תמונה"
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <label className="flex items-center gap-2"><Checkbox checked={catalogForm.in_stock} onChange={(event) => updateCatalogForm("in_stock", event.currentTarget.checked)} /> במלאי</label>
              <label className="flex items-center gap-2"><Checkbox checked={catalogForm.is_hidden} onChange={(event) => updateCatalogForm("is_hidden", event.currentTarget.checked)} /> העבר לארכיון (מוסתר)</label>
              <label className="flex items-center gap-2"><Checkbox checked={catalogForm.show_in_regular} onChange={(event) => updateCatalogForm("show_in_regular", event.currentTarget.checked)} /> הצג בקטגוריה רגילה</label>
              <label className="flex items-center gap-2"><Checkbox checked={catalogForm.show_in_discount} onChange={(event) => updateCatalogForm("show_in_discount", event.currentTarget.checked)} /> הצג בקטגוריית מבצעים</label>
              <label className="flex items-center gap-2"><Checkbox checked={catalogForm.show_on_home} onChange={(event) => updateCatalogForm("show_on_home", event.currentTarget.checked)} /> הצג בהצצה בדף הבית</label>
              <label className="flex items-center gap-2"><Checkbox checked={catalogForm.is_active} onChange={(event) => updateCatalogForm("is_active", event.currentTarget.checked)} /> פעיל</label>
            </div>
            {fieldErrors.locations ? <p className="text-xs text-red-600">{fieldErrors.locations}</p> : null}
            {fieldErrors.general ? <p className="text-xs text-red-600">{fieldErrors.general}</p> : null}
            <div className="flex gap-2">
              <Button onClick={() => void saveProduct()} disabled={savingCatalog || uploadingCatalogImage || !isFormValid} className="flex-1 bg-cta hover:bg-cta-foreground text-white font-bold">
                {savingCatalog || uploadingCatalogImage ? "שומר..." : "שמירה ועדכון מוצר"}
              </Button>
              <Button onClick={resetForm} variant="outline">ניקוי</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}

function SortableCatalogCard({
  product,
  onEdit,
  onDelete,
}: {
  product: AdminCatalogProduct
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id })
  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex h-full flex-col"
      onClick={onEdit}
    >
      <div className="relative h-40 bg-gray-100">
        <CatalogImage src={product.image_url} alt={product.image_alt || product.name} />
      </div>
      <CardHeader className="space-y-2 p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
          <button
            className="text-gray-500 hover:text-gray-800 cursor-grab"
            title="גרור לשינוי סדר"
            onClick={(event) => event.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-0.5">
          {product.original_price !== null ? (
            <p className="text-xs text-gray-500 line-through">
              ₪{product.original_price}
            </p>
          ) : null}
          <p className="text-sm font-semibold">₪{product.price}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-1 flex-1">
        <div className="flex flex-wrap gap-2">
          <Badge className={product.in_stock ? "bg-emerald-200 text-emerald-950 border-emerald-400" : "bg-red-200 text-red-950 border-red-400"}>{product.in_stock ? "במלאי" : "חסר מלאי"}</Badge>
          {product.is_hidden ? <Badge className="bg-slate-300 text-slate-950 border-slate-500">בארכיון</Badge> : null}
          {product.show_in_regular ? <Badge className="bg-indigo-200 text-indigo-950 border-indigo-500">רגיל</Badge> : null}
          {product.show_in_discount ? <Badge className="bg-amber-200 text-amber-950 border-amber-500">מבצע</Badge> : null}
          {product.show_on_home ? <Badge className="bg-fuchsia-200 text-fuchsia-950 border-fuchsia-500">דף הבית</Badge> : null}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto flex flex-wrap gap-2 justify-between">
        <Button
          onClick={(event) => {
            event.stopPropagation()
            onEdit()
          }}
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold"
        >
          לפרטים ועדכון
        </Button>
        <Button
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
          מחיקה מלאה
        </Button>
      </CardFooter>
    </Card>
  )
}

function CatalogImage({ src, alt }: { src: string; alt: string }) {
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  return (
    <div className="relative h-full w-full">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
        </div>
      ) : null}
      {!failed ? (
        <OptimizedImage
          src={src}
          alt={alt}
          width={640}
          height={360}
          crop="fill"
          className="w-full h-full object-cover"
          onLoad={() => setLoading(false)}
          onError={() => {
            setFailed(true)
            setLoading(false)
          }}
        />
      ) : (
        <div className="h-full w-full bg-slate-200 flex items-center justify-center text-xs text-slate-700">
          אין תמונה זמינה
        </div>
      )}
    </div>
  )
}
