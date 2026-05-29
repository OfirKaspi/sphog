import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import { publishPrivateWorkshopLogosFromDraft } from "@/lib/api/privateWorkshopLogosData"
import { revalidatePrivateWorkshopsPage } from "@/lib/revalidatePrivateWorkshops"

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const result = await publishPrivateWorkshopLogosFromDraft()
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Publish failed" }, { status: 500 })
  }

  const revalidated = revalidatePrivateWorkshopsPage()

  return NextResponse.json({ success: true, revalidated })
}
