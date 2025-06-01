/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";

// ✅ Monday config
const MONDAY_API_KEY = process.env.MONDAY_API_KEY!;
const MONDAY_BOARD_ID = process.env.MONDAY_BOARD_ID!;
const MONDAY_GROUP_ID = process.env.MONDAY_GROUP_ID!;

// ✅ Input validation schema
const leadSchema = z.object({
  fullName: z.string().nonempty("נדרש שם מלא."),
  phoneNumber: z.string().regex(/^05\d{8}$/, "אנא מלא מספר טלפון תקין."),
  requestedService: z.enum(["סדנה פרטית", "סדנה לקבוצה גדולה"]),
  additionalDetails: z.string().optional(),
});

// ✅ In-memory IP rate limiter
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// ✅ Sanitize strings
const sanitize = (val: string) =>
  val?.replace(/[\n\r]+/g, "").trim().slice(0, 100);

// ✅ Send to Monday.com
async function sendToMonday(itemName: string, values: Record<string, any>) {
  const columnValues = {
    "text_mkrg5n7j": values.full_name,               // Full Name
    "phone_mkrg6e36": {
      phone: values.phone,
      countryShortName: "IL",
    },                                               // Phone (object format)
    "text_mkrgmb8d": values.requested_service,       // Requested Service
    "text_mkrg8ae1": values.details,                 // Additional Details
    "text_mkrgstnp": values.lead_source,             // Lead Source
  };

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
  };

  const res = await axios.post("https://api.monday.com/v2", query, {
    headers: {
      Authorization: MONDAY_API_KEY,
      "Content-Type": "application/json",
    },
  });

  const responseData = res.data;
  
  // ✅ Confirm that the item was actually created
  if (!responseData?.data?.create_item?.id) {
    console.error("❌ Monday item creation failed:", responseData);
    throw new Error("השליחה נכשלה — נסה שוב מאוחר יותר.");
  }

  console.log("✅ Monday item created:", responseData.data.create_item.id);
}

// ✅ Main POST handler
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const rateInfo = rateLimitMap.get(ip);

  // 🛡️ IP-based rate limiting
  if (rateInfo) {
    if (now - rateInfo.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (rateInfo.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { success: false, message: "יותר מדי בקשות, נסה שוב בעוד כמה דקות." },
          { status: 429 }
        );
      }
      rateInfo.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
  }

  try {
    // ✅ Parse + validate input
    const body = await req.json();
    const data = leadSchema.parse(body);

    const fullName = sanitize(data.fullName);
    const phone = sanitize(data.phoneNumber);
    const requestedService = sanitize(data.requestedService);
    const details = sanitize(data.additionalDetails || "");

    await sendToMonday(fullName, {
      full_name: fullName,
      phone: phone,
      requested_service: requestedService,
      details: details,
      lead_source: "טופס לידים אתר - כללי",
    });

    return NextResponse.json(
      { success: true, message: "הפרטים נשלחו בהצלחה!" },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.format() }, { status: 400 });
    }

    console.error("❌ Monday API Error:", error.message);
    return NextResponse.json({ success: false, message: "שגיאה בשליחה, נסה שוב." }, { status: 500 });
  }
}
