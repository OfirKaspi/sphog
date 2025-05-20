// ****************************************
// MAKE SURE TO CHANGE WEBSITE URL 
// COMMENT IT AS WELL IN DEV
// ****************************************

/* eslint-disable @typescript-eslint/no-explicit-any */

// ✅ This API route receives new leads from the frontend.
// It stores the lead in Upstash Redis and pushes the key to `crm:unsynced:list`,
// so it can be synced to Zoho CRM later by the cron job.
// It uses manual axios calls instead of @vercel/kv for more control.

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import axios from "axios"
import { CONFIG } from "@/config/config"

// 🔐 Environment variables for Upstash Redis (set in Vercel or .env)
const {
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
} = CONFIG

// ✅ Zod validation schema to ensure data integrity on the backend
const leadSchema = z.object({
  full_name: z.string().nonempty("נדרש שם מלא."),
  email: z.string().email("כתובת אימייל שגויה."),
  phone: z.string().regex(/^05\d{8}$/, "אנא מלא מספר טלפון תקין."),
  requested_service: z.enum(["פיתוח אתרים", "עיצוב", "שיווק"]),
  newsletter: z.boolean().optional().default(true),
})

// 🔁 Rate limiting configuration: max 5 requests per 10 minutes per IP
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 600 // seconds (10 minutes)

// 🔁 Helper function to POST to Redis with headers
const redisRequest = (url: string, data?: any) =>
  axios.post(`${UPSTASH_REDIS_REST_URL}${url}`, data, {
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
  })

export async function POST(req: NextRequest) {
  try {
    // 🌐 Capture user's IP and request origin for security
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    const origin = req.headers.get("origin")

    // ❌ Block requests that don't come from your domain
    if (origin && origin !== "https://thelevelupagency.com") {
      return NextResponse.json(
        { success: false, message: "Unauthorized origin" },
        { status: 403 }
      )
    }

    // 🔐 Check rate limiting: how many times this IP submitted recently
    const rateKey = `rate-limit:${ip}`
    const rateCount = await axios.get(`${UPSTASH_REDIS_REST_URL}/get/${rateKey}`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      },
    })

    const count = Number(rateCount.data.result || 0)

    // ❌ Block if over limit
    if (count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // ✅ Otherwise, increase the submission count for this IP
    await redisRequest(`/incr/${rateKey}`)

    // ⏳ Set a TTL (Time-To-Live) for this IP's key — auto delete after 10 minutes
    await redisRequest(`/expire/${rateKey}/${RATE_LIMIT_WINDOW}`)

    // ✅ Parse and validate form input from body using Zod
    const body = await req.json()
    const validatedLead = leadSchema.parse(body)

    // 🧽 Sanitize input: remove newlines, trim, and limit length
    const sanitize = (val: string) => val?.replace(/[\n\r]+/g, "").trim().slice(0, 100)

    // 🗃️ Prepare lead data with timestamp for storage
    const leadWithTimestamp = {
      full_name: sanitize(validatedLead.full_name),
      email: sanitize(validatedLead.email.toLowerCase()),
      phone: sanitize(validatedLead.phone),
      requested_service: sanitize(validatedLead.requested_service),
      newsletter: validatedLead.newsletter,
      created_at: new Date().toLocaleString("en-IL", { timeZone: "Asia/Jerusalem" }),
      crm_synced: false,
      lead_source: "אתר מרכזי",
    }

    const id = crypto.randomUUID()
    const key = `lead:${id}`

    // 💾 Save the lead to Redis using SET
    await redisRequest(`/set/${key}`, JSON.stringify(leadWithTimestamp))

    // 📥 Push the lead's key into the CRM sync queue list
    await redisRequest(`/lpush/crm:unsynced:list`, key)

    return NextResponse.json(
      {
        success: true,
        message: "הפרטים נשלחו בהצלחה, ניצור איתך קשר בהקדם",
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("❌ API Error:", error.message)

    // ❗ Return Zod validation errors if form input is invalid
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.format() }, { status: 400 })
    }

    // ❗ Catch-all server error
    return NextResponse.json(
      { success: false, message: "אירעה שגיאה, אנא נסה שוב מאוחר יותר" },
      { status: 500 }
    )
  }
}
