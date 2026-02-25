import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { normalizeIsraeliPhone } from "@/lib/phone"

const resend = new Resend(process.env.RESEND_API_KEY)

const NOTIFICATION_EMAIL = process.env.PRODUCT_LEAD_NOTIFICATION_EMAIL!
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "leads@resend.dev"

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

const productLeadSchema = z.object({
  fullName: z.string().nonempty("נדרש שם מלא."),
  phoneNumber: z.string().transform((value, ctx) => {
    const normalizedPhone = normalizeIsraeliPhone(value)
    if (!normalizedPhone) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "אנא מלא מספר טלפון תקין." })
      return z.NEVER
    }
    return normalizedPhone
  }),
  message: z.string().nonempty("נדרשת הודעה.").max(500),
  productName: z.string().nonempty("שם המוצר נדרש."),
  productId: z.string().optional(),
  productImage: z.string().url().optional(),
})

const sanitize = (val: string) => val?.replace(/[\n\r]+/g, "").trim().slice(0, 500)
const sanitizeShort = (val: string) => val?.replace(/[\n\r]+/g, "").trim().slice(0, 100)

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

interface EmailData {
  fullName: string
  phone: string
  message: string
  productName: string
  productId: string
  productImage: string
}

function buildEmailHtml({ fullName, phone, message, productName, productId, productImage }: EmailData) {
  const imageSection = productImage
    ? `<tr>
          <td style="padding:0;" align="center">
            <img
              src="${productImage}"
              alt="${escapeHtml(productName)}"
              width="560"
              style="display:block;width:100%;max-width:560px;height:auto;object-fit:cover;max-height:320px;"
            />
          </td>
        </tr>`
    : ""

  const productIdRow = productId
    ? `<tr>
                <td style="padding:10px 16px;font-size:12px;color:#6b7280;font-weight:600;width:100px;text-align:right;">מזהה</td>
                <td style="padding:10px 16px;font-size:12px;color:#6b7280;font-family:monospace;text-align:right;">${escapeHtml(productId)}</td>
              </tr>`
    : ""

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#F0FCFF;font-family:'Segoe UI',Arial,Helvetica,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FCFF;padding:32px 16px;" dir="rtl">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);max-width:100%;">

        <tr>
          <td style="background:linear-gradient(135deg,#10893C,#14A800);padding:28px 32px;text-align:right;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">ליד חדש מהחנות 🛒</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">מישהו מתעניין במוצר באתר</p>
          </td>
        </tr>

        ${imageSection}

        <tr>
          <td style="padding:24px 32px 8px;text-align:right;">
            <h2 style="margin:0;font-size:18px;color:#070A12;font-weight:700;">${escapeHtml(productName)}</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 32px 24px;text-align:right;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #d1e7dd;border-radius:10px;overflow:hidden;">
              <tr style="background:#f0fdf4;">
                <td style="padding:12px 16px;font-size:13px;color:#6b7280;font-weight:600;width:100px;border-bottom:1px solid #d1e7dd;text-align:right;">שם מלא</td>
                <td style="padding:12px 16px;font-size:15px;color:#070A12;border-bottom:1px solid #d1e7dd;text-align:right;">${escapeHtml(fullName)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#6b7280;font-weight:600;border-bottom:1px solid #d1e7dd;text-align:right;">טלפון</td>
                <td style="padding:12px 16px;font-size:15px;color:#070A12;border-bottom:1px solid #d1e7dd;text-align:right;">
                  <a href="tel:${escapeHtml(phone)}" style="color:#E32662;text-decoration:none;font-weight:600;">${escapeHtml(phone)}</a>
                </td>
              </tr>
              <tr style="background:#f0fdf4;">
                <td style="padding:12px 16px;font-size:13px;color:#6b7280;font-weight:600;border-bottom:1px solid #d1e7dd;text-align:right;">מוצר</td>
                <td style="padding:12px 16px;font-size:15px;color:#070A12;font-weight:600;border-bottom:1px solid #d1e7dd;text-align:right;">${escapeHtml(productName)}</td>
              </tr>
              ${productIdRow}
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 32px 24px;text-align:right;">
            <div style="background:#F0FCFF;border:1px solid #b6e6d9;border-radius:10px;padding:16px 18px;">
              <p style="margin:0 0 6px;font-size:12px;color:#10893C;font-weight:700;">💬 הודעת הלקוח/ה</p>
              <p style="margin:0;font-size:14px;color:#070A12;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:0 32px 12px;" align="center">
            <a href="tel:${escapeHtml(phone)}" style="display:inline-block;min-width:240px;text-align:center;background:#E32662;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
              📞 התקשר/י ללקוח/ה
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:0 32px 28px;" align="center">
            <a href="https://wa.me/972${escapeHtml(phone).slice(1)}" style="display:inline-block;min-width:240px;text-align:center;background:#25D366;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
              💬 שלח/י הודעה בוואטסאפ
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 32px;background:#f0fdf4;border-top:1px solid #d1e7dd;">
            <p style="margin:0;font-size:12px;color:#6b7280;text-align:center;">נשלח אוטומטית מאתר SPHOG</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()
  const rateInfo = rateLimitMap.get(ip)

  if (rateInfo) {
    if (now - rateInfo.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (rateInfo.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { success: false, message: "יותר מדי בקשות, נסו שוב בעוד כמה דקות." },
          { status: 429 }
        )
      }
      rateInfo.count += 1
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now })
    }
  } else {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
  }

  try {
    const body = await req.json()
    const data = productLeadSchema.parse(body)

    const fullName = sanitizeShort(data.fullName)
    const phone = sanitizeShort(data.phoneNumber)
    const message = sanitize(data.message)
    const productName = sanitizeShort(data.productName)
    const productId = data.productId ? sanitizeShort(data.productId) : ""
    const productImage = data.productImage || ""

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      subject: `ליד חדש מהחנות: ${fullName} - ${productName}`,
      html: buildEmailHtml({ fullName, phone, message, productName, productId, productImage }),
    })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true, message: "הפרטים נשלחו בהצלחה!" }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.format() }, { status: 400 })
    }

    console.error("Product lead submission error:", error instanceof Error ? error.message : error)
    return NextResponse.json({ success: false, message: "שגיאה בשליחה, נסו שוב." }, { status: 500 })
  }
}
