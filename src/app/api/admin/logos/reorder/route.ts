import { NextRequest, NextResponse } from "next/server"

import { requireAdminAuth } from "@/lib/adminAuth"
import { reorderDraftPrivateWorkshopLogos } from "@/lib/api/privateWorkshopLogosData"
import { reorderPrivateWorkshopLogosSchema } from "@/lib/api/privateWorkshopLogosValidation"

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const payload = await request.json().catch(() => null)
  const parsed = reorderPrivateWorkshopLogosSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { error } = await reorderDraftPrivateWorkshopLogos(parsed.data.items)
  if (error) {
    return NextResponse.json({ error: "Failed to reorder logos" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
