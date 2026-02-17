"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, LogOut, Package } from "lucide-react"

import { useAppToast } from "@/hooks/useAppToast"

type AdminShellProps = {
  title: string
  onLogout: () => Promise<void>
  children: React.ReactNode
}

export default function AdminShell({ title, onLogout, children }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const toast = useAppToast()

  const handleLogout = async () => {
    await onLogout()
    toast.success("התנתקת בהצלחה")
    router.replace("/admin")
  }

  const schedulesActive = pathname.startsWith("/admin/schedules")
  const catalogActive = pathname.startsWith("/admin/catalog")

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            יציאה
          </button>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/schedules"
            className={`rounded-lg px-4 py-2 inline-flex items-center gap-2 ${schedulesActive ? "bg-green-600 text-white" : "bg-white border"}`}
          >
            <Calendar className="w-4 h-4" />
            ניהול סדנאות
          </Link>
          <Link
            href="/admin/catalog"
            className={`rounded-lg px-4 py-2 inline-flex items-center gap-2 ${catalogActive ? "bg-green-600 text-white" : "bg-white border"}`}
          >
            <Package className="w-4 h-4" />
            ניהול קטלוג
          </Link>
        </div>

        {children}
      </div>
    </div>
  )
}
