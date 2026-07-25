/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import {
  attributionSchema,
  buildMondayUtmTextColumns,
  formatMondayCampaign,
  formatMondayLeadSource,
  sanitizeAttribution,
  type Attribution,
} from "@/lib/attribution";
import { normalizeIsraeliPhone } from "@/lib/phone";

// ✅ Environment variables
const MONDAY_API_KEY = process.env.MONDAY_API_KEY!;
const MONDAY_BOARD_ID = process.env.MONDAY_BOARD_ID!;
const MONDAY_GROUP_ID = process.env.MONDAY_GROUP_ID!;

// ✅ Zod schema for input validation
const workshopSchema = z.object({
  fullName: z.string().nonempty("נדרש שם מלא."),
  phoneNumber: z.string().transform((value, ctx) => {
    const normalizedPhone = normalizeIsraeliPhone(value);
    if (!normalizedPhone) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "אנא מלא מספר טלפון תקין." });
      return z.NEVER;
    }
    return normalizedPhone;
  }),
  selectedDate: z.string().nonempty("נדרש תאריך."),
  selectedHour: z.string().nonempty("נדרשת שעה."),
  additionalDetails: z.string().optional(),
  attribution: attributionSchema,
});

// ✅ Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// ✅ Clean up user inputs for Monday text columns
const sanitize = (val: string, max = 100) =>
  val?.replace(/[\n\r]+/g, " ").trim().slice(0, max);

// ✅ Send the lead into Monday.com
async function sendToMonday(
  itemName: string,
  values: Record<string, any>,
  attribution: Attribution | null
) {
  const columnValues: Record<string, any> = {
    "name": values.full_name,                          // Full Name
    "text__1": values.details,                         // Additional Details
    "lead_phone": {                                    // 📞 Phone (must be object format!)
      phone: values.phone,
      countryShortName: "IL",                          // ISO country code for phone format
    },
    "date_mkpveq7w": values.selected_date,             // Selected Date
    "text_mks28kgr": values.selected_hour,              // Selected Hour
    "dup__of_channel9__1": values.lead_source,         // Lead Source (e.g. "Website - Workshop")
    "dup__of_channel__1": values.campaign,             // Campaign (form type status, e.g. "WS form")
  };

  // Additive dedicated UTM text columns (allowlisted IDs only)
  Object.assign(columnValues, buildMondayUtmTextColumns(attribution));

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

  // 🛡️ Rate limiting check
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
    const body = await req.json();
    const data = workshopSchema.parse(body);

    const fullName = sanitize(data.fullName);
    const phone = sanitize(data.phoneNumber);
    const selectedDate = sanitize(data.selectedDate);
    const selectedHour = sanitize(data.selectedHour);
    const details = sanitize(data.additionalDetails || "", 200);

    const attribution = sanitizeAttribution(data.attribution);

    await sendToMonday(
      fullName,
      {
        full_name: fullName,
        phone: phone,
        details: details,
        selected_date: selectedDate,
        selected_hour: selectedHour,
        lead_source: formatMondayLeadSource(attribution),
        campaign: formatMondayCampaign("WSForm"),
      },
      attribution
    );

    return NextResponse.json(
      { success: true, message: "הפרטים נשלחו בהצלחה!" },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.format() }, { status: 400 });
    }

    console.error("❌ Monday API Error:", err.message);
    return NextResponse.json({ success: false, message: "שגיאה בשליחה, נסה שוב." }, { status: 500 });
  }
}
