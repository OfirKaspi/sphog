import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { requireAdminAuth } from "@/lib/adminAuth"
import { publishPrivateWorkshopLogosFromDraft } from "@/lib/api/privateWorkshopLogosData"

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const result = await publishPrivateWorkshopLogosFromDraft()
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Publish failed" }, { status: 500 })
  }

  try {
    revalidatePath("/private-workshops")
  } catch (revalidateError) {
    console.log("Logos revalidation warning:", revalidateError)
  }

  return NextResponse.json({ success: true })
}
