import { NextRequest } from "next/server"

import { getSupabaseServiceRoleClient, supabase } from "@/lib/supabase"

export type AdminAuthResult =
  | { ok: true; userId: string; accessToken: string }
  | { ok: false; status: number; error: string }

export async function requireAdminAuth(request: NextRequest): Promise<AdminAuthResult> {
  const authorization = request.headers.get("authorization")
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return { ok: false, status: 401, error: "Unauthorized" }
  }

  const accessToken = authorization.split(" ")[1]
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)

  if (userError || !userData.user) {
    return { ok: false, status: 401, error: "Unauthorized" }
  }

  const adminClient = getSupabaseServiceRoleClient()
  const { data: isAdmin, error: roleError } = await adminClient.rpc("is_admin", {
    uid: userData.user.id,
  })

  if (roleError || !isAdmin) {
    return { ok: false, status: 403, error: "Forbidden" }
  }

  return { ok: true, userId: userData.user.id, accessToken }
}
