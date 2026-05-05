import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { requireAdminAuth } from "@/lib/adminAuth"
import { updatePrivateWorkshopCarouselEnabled } from "@/lib/api/privateWorkshopLogosData"
import { updatePrivateWorkshopSettingsSchema } from "@/lib/api/privateWorkshopLogosValidation"

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const payload = await request.json().catch(() => null)
  const parsed = updatePrivateWorkshopSettingsSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { data, error } = await updatePrivateWorkshopCarouselEnabled(parsed.data.carousel_enabled)
  if (error || !data) {
    console.error("updatePrivateWorkshopCarouselEnabled:", error?.message ?? "no row")
    return NextResponse.json(
      {
        error: "Failed to update settings",
        ...(process.env.NODE_ENV === "development" ? { detail: error?.message } : {}),
      },
      { status: 500 }
    )
  }

  try {
    revalidatePath("/private-workshops")
  } catch (revalidateError) {
    console.log("Settings revalidation warning:", revalidateError)
  }

  return NextResponse.json(data)
}
