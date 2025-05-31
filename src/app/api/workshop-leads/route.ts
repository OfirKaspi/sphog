/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { CONFIG } from "@/config/config";

// 🔐 Environment variables for Upstash Redis (set in Vercel or .env)
const {
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
} = CONFIG;

// ✅ Zod validation schema to ensure data integrity on the backend
const workshopLeadSchema = z.object({
  selectedDate: z.string().nonempty("נדרש תאריך."),
  selectedHour: z.string().nonempty("נדרשת שעה."),
  fullName: z.string().nonempty("נדרש שם מלא."),
  phoneNumber: z.string().regex(/^05\d{8}$/, "אנא מלא מספר טלפון תקין."),
  additionalDetails: z.string().optional(),
});

// 🔁 Helper function to POST to Redis with headers
const redisRequest = (url: string, data?: any) =>
  axios.post(`${UPSTASH_REDIS_REST_URL}${url}`, data, {
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

export async function POST(req: NextRequest) {
  try {
    // ✅ Parse and validate form input from body using Zod
    const body = await req.json();
    const validatedLead = workshopLeadSchema.parse(body);

    // 🧽 Sanitize input: remove newlines, trim, and limit length
    const sanitize = (val: string) => val?.replace(/[\n\r]+/g, "").trim().slice(0, 100);

    // 🗃️ Prepare lead data with timestamp for storage
    const leadWithTimestamp = {
      selectedDate: sanitize(validatedLead.selectedDate),
      selectedHour: sanitize(validatedLead.selectedHour),
      fullName: sanitize(validatedLead.fullName),
      phoneNumber: sanitize(validatedLead.phoneNumber),
      additionalDetails: sanitize(validatedLead.additionalDetails || ""),
      createdAt: new Date().toLocaleString("en-IL", { timeZone: "Asia/Jerusalem" }),
      crmSynced: false,
      leadSource: "טופס לידים אתר - סדנאות",
    };

    const id = crypto.randomUUID();
    const key = `workshop-lead:${id}`;

    // 💾 Save the lead to Redis using SET
    await redisRequest(`/set/${key}`, JSON.stringify(leadWithTimestamp));

    // 📥 Push the lead's key into the CRM sync queue list
    await redisRequest(`/lpush/crm:unsynced:list`, key);

    return NextResponse.json(
      {
        success: true,
        message: "הפרטים נשלחו בהצלחה, ניצור איתך קשר בהקדם",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ API Error:", error.message);

    // ❗ Return Zod validation errors if form input is invalid
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.format() }, { status: 400 });
    }

    // ❗ Catch-all server error
    return NextResponse.json(
      { success: false, message: "אירעה שגיאה, אנא נסה שוב מאוחר יותר" },
      { status: 500 }
    );
  }
}
