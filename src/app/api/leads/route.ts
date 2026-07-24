/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import {
  appendAttributionToDetails,
  attributionSchema,
  buildMondayUtmTextColumns,
  formatMondayCampaign,
  formatMondayLeadSource,
  sanitizeAttribution,
  type Attribution,
} from "@/lib/attribution";
import { normalizeIsraeliPhone } from "@/lib/phone";

// ✅ Monday config
const MONDAY_API_KEY = process.env.MONDAY_API_KEY!;
const MONDAY_BOARD_ID = process.env.MONDAY_BOARD_ID!;
const MONDAY_GROUP_ID = process.env.MONDAY_GROUP_ID!;

// ✅ Input validation schema
const leadSchema = z.object({
  fullName: z.string().nonempty("נדרש שם מלא."),
  phoneNumber: z.string().transform((value, ctx) => {
    const normalizedPhone = normalizeIsraeliPhone(value);
    if (!normalizedPhone) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "אנא מלא מספר טלפון תקין." });
      return z.NEVER;
    }
    return normalizedPhone;
  }),
  topic: z.enum(["סדנא פרטית", "הצטרפות לסדנא קבוצתית", "קניית טרריום", "אחר"]),
  details: z.string().optional(),
  attribution: attributionSchema,
});

// ✅ In-memory IP rate limiter
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// ✅ Sanitize strings (details may include an appended UTM note)
const sanitize = (val: string, max = 100) =>
  val?.replace(/[\n\r]+/g, " ").trim().slice(0, max);

// ✅ Topic mapping
const topicMapping: Record<string, string> = {
  "סדנא פרטית": "Private",
  "הצטרפות לסדנא קבוצתית": "Adults",
  "קניית טרריום": "Buy",
  "אחר": "",
};

// ✅ Send to Monday.com
async function sendToMonday(
  itemName: string,
  values: Record<string, any>,
  attribution: Attribution | null
) {
  const columnValues: Record<string, any> = {
    "name": values.full_name,                              // Full Name
    "lead_phone": {
      phone: values.phone,
      countryShortName: "IL",
    },                                                     // Phone (object format)
    "text__1": values.details,                             // What do you want to know
    "dup__of_channel9__1": values.lead_source,             // Lead Source (e.g. "Website - Workshop")
    "dup__of_channel__1": values.campaign,                 // Campaign (form type status)
  };

  if (values.topic) {
    columnValues["dup__of_channel2__1"] = values.topic;    // Topic (only if not "Other")
  }

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
    const topic = sanitize(data.topic);
    const mappedTopic = topicMapping[topic];
    const details = sanitize(data.details || "", 200);

    const attribution = sanitizeAttribution(data.attribution);

    await sendToMonday(
      fullName,
      {
        full_name: fullName,
        phone: phone,
        topic: mappedTopic,
        details: appendAttributionToDetails(details, attribution, 500),
        lead_source: formatMondayLeadSource(attribution),
        campaign: formatMondayCampaign("GeneralForm"),
      },
      attribution
    );

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
