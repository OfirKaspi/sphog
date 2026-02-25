"use client"

import { FormEvent, useState } from "react"

import { useAppToast } from "@/hooks/useAppToast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { normalizeIsraeliPhone } from "@/lib/phone"

interface ProductLeadFormProps {
  productId: string | number
  productName: string
  productImage: string
}

const ProductLeadForm = ({ productId, productName, productImage }: ProductLeadFormProps) => {
  const defaultMessage = `אני מעוניינ/ת בפריט "${productName}". אשמח לפרטים נוספים`
  const toast = useAppToast()

  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState(defaultMessage)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ fullName?: string; phoneNumber?: string; message?: string }>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validate = () => {
    const nextErrors: { fullName?: string; phoneNumber?: string; message?: string } = {}
    if (!fullName.trim()) {
      nextErrors.fullName = "נדרש שם מלא"
    }

    if (!normalizeIsraeliPhone(phoneNumber)) {
      nextErrors.phoneNumber = "אנא מלא מספר טלפון תקין"
    }

    if (!message.trim()) {
      nextErrors.message = "נדרשת הודעה"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) {
      return
    }
    const normalizedPhoneNumber = normalizeIsraeliPhone(phoneNumber)
    if (!normalizedPhoneNumber) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/product-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phoneNumber: normalizedPhoneNumber,
          message,
          productName,
          productId: String(productId),
          productImage,
        }),
      })

      const result = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(result?.message || "Submission failed")
      }

      setIsSubmitted(true)
      setFullName("")
      setPhoneNumber("")
      setMessage("")
      toast.success("הפרטים נשלחו בהצלחה")
    } catch (error) {
      console.error("Product lead submit failed:", error)
      toast.error("אופס, משהו קרה. אנא נסו שוב.")
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        תודה! קיבלנו את הפרטים שלכם ונחזור אליכם בהקדם.
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <Label htmlFor={`product-lead-name-${productId}`}>שם מלא</Label>
        <Input
          id={`product-lead-name-${productId}`}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="ישראל ישראלי"
          className="mt-1 bg-slate-50 border-slate-200"
        />
        {errors.fullName ? <p className="mt-1 text-sm text-red-600">{errors.fullName}</p> : null}
      </div>

      <div>
        <Label htmlFor={`product-lead-phone-${productId}`}>טלפון</Label>
        <Input
          id={`product-lead-phone-${productId}`}
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="********05"
          className="mt-1 bg-slate-50 border-slate-200"
        />
        {errors.phoneNumber ? <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p> : null}
      </div>

      <div>
        <Label htmlFor={`product-lead-message-${productId}`}>הודעה</Label>
        <Textarea
          id={`product-lead-message-${productId}`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-1 min-h-24 resize-none bg-slate-50 border-slate-200 text-slate-700 transition-colors"
        />
        {errors.message ? <p className="mt-1 text-sm text-red-600">{errors.message}</p> : null}
      </div>

      <Button type="submit" className="w-full bg-cta hover:bg-cta-foreground font-bold" disabled={loading}>
        {loading ? "שולח..." : "שלחו לי פרטים"}
      </Button>
    </form>
  )
}

export default ProductLeadForm
