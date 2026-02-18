"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Shield } from "lucide-react"

import { useAdminSession } from "@/hooks/useAdminSession"

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  )
}

function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { supabase, isCheckingAuth, isAuthenticated } = useAdminSession()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTarget = searchParams.get("redirect") || "/admin/schedules"

  useEffect(() => {
    if (isCheckingAuth) {
      return
    }
    if (isAuthenticated) {
      router.replace(redirectTarget)
    }
  }, [isAuthenticated, isCheckingAuth, redirectTarget, router])

  const signIn = async () => {
    if (!supabase) {
      return
    }
    setAuthError("")
    setIsSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsSubmitting(false)
    if (error) {
      setAuthError(error.message)
      return
    }
    setPassword("")
    router.replace(redirectTarget)
  }

  if (isCheckingAuth || isAuthenticated) {
    return (
      <div className="bg-background flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <div className="bg-background flex items-center justify-center px-4 py-20">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-green-100" dir="rtl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">כניסה למנהל</h1>
          <p className="text-gray-600 mt-2">התחברות עם משתמש Supabase בעל הרשאת admin</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-gray-300 p-4 rounded-xl text-right"
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && void signIn()}
            className="w-full border border-gray-300 p-4 rounded-xl text-right"
          />
          {authError ? <p className="text-red-600 text-sm">{authError}</p> : null}

          <button
            onClick={() => void signIn()}
            disabled={!email || !password || isSubmitting}
            className="w-full bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 disabled:bg-gray-300"
          >
            {isSubmitting ? "מתחבר..." : "כניסה למערכת"}
          </button>
        </div>
      </div>
    </div>
  )
}