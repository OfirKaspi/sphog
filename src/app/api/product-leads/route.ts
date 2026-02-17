/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { z } from "zod"

const MONDAY_API_KEY = process.env.MONDAY_API_KEY!
const MONDAY_BOARD_ID = process.env.MONDAY_BOARD_ID!
const MONDAY_GROUP_ID = process.env.MONDAY_GROUP_ID!

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

const productLeadSchema = z.object({
  fullName: z.string().nonempty("נדרש שם מלא."),
  phoneNumber: z.string().regex(/^05\d{8}$/, "אנא מלא מספר טלפון תקין."),
  productName: z.string().nonempty("שם המוצר נדרש."),
  productId: z.string().optional(),
})

const sanitize = (val: string) => val?.replace(/[\n\r]+/g, "").trim().slice(0, 100)

async function sendToMonday(itemName: string, values: Record<string, any>) {
  const columnValues: Record<string, any> = {
    name: values.full_name,
    lead_phone: {
      phone: values.phone,
      countryShortName: "IL",
    },
    text__1: values.details,
    dup__of_channel9__1: values.lead_source,
    dup__of_channel__1: values.campaign,
    dup__of_channel2__1: "Buy",
  }

  const query = {
    query: `
      mutation {
        create_item(
          board_id: ${MONDAY_BOARD_ID},
          item_name: "${itemName}",
          group_id: "${MONDAY_GROUP_ID}",
          column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}"
        ) {
          id
        }
      }
    `,
  }

  const response = await axios.post("https://api.monday.com/v2", query, {
    headers: {
      Authorization: MONDAY_API_KEY,
      "Content-Type": "application/json",
    },
  })

  if (!response.data?.data?.create_item?.id) {
    throw new Error("Monday create_item failed")
  }
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

    const fullName = sanitize(data.fullName)
    const phone = sanitize(data.phoneNumber)
    const productName = sanitize(data.productName)
    const productId = data.productId ? sanitize(data.productId) : ""
    const lockedMessage = `אני מעוניינ/ת בפריט "${productName}". אשמח לפרטים נוספים`
    const details = productId ? `${lockedMessage} (ID: ${productId})` : lockedMessage

    await sendToMonday(`${fullName} - ${productName}`, {
      full_name: fullName,
      phone,
      details,
      lead_source: "Website",
      campaign: "Product inquiry",
    })

    return NextResponse.json({ success: true, message: "הפרטים נשלחו בהצלחה!" }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.format() }, { status: 400 })
    }

    console.error("Product lead submission error:", error?.message || error)
    return NextResponse.json({ success: false, message: "שגיאה בשליחה, נסו שוב." }, { status: 500 })
  }
}
