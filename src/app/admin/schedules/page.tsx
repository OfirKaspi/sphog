"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns"
import { Calendar, Clock, Plus, Settings, Trash2, Users } from "lucide-react"

import AdminShell from "@/components/admin/AdminShell"
import { useAppToast } from "@/hooks/useAppToast"
import { useAdminSession } from "@/hooks/useAdminSession"
import { WorkshopSchedule } from "@/types/workshop"

const PRIVATE_HOURS = ["11:00-14:00", "14:30-17:30", "18:30-21:30"]
const PUBLIC_HOURS = ["11:00-14:00", "17:30-20:30", "18:00-21:00"]
const WORKSHOP_TYPES = {
  family: "משפחתית",
  tech: "טכניקות",
  advanced: "מתקדמת",
  unavailable: "לא זמין",
} as const

type ViewType = "private" | "public"

function getMonthFromQuery(value: string | null) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return new Date()
  }
  return new Date(`${value}-01T00:00:00`)
}

export default function AdminSchedulesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
        </div>
      }
    >
      <AdminSchedulesContent />
    </Suspense>
  )
}

function AdminSchedulesContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const toast = useAppToast()
  const { isAuthenticated, isCheckingAuth, getAuthHeaders, signOut } = useAdminSession()

  const [schedules, setSchedules] = useState<WorkshopSchedule[]>([])
  const [viewType, setViewType] = useState<ViewType>(
    searchParams.get("view") === "public" ? "public" : "private"
  )
  const [selectedDate, setSelectedDate] = useState(searchParams.get("date") || "")
  const [currentMonth, setCurrentMonth] = useState(getMonthFromQuery(searchParams.get("month")))
  const [loadingSchedules, setLoadingSchedules] = useState(false)
  const [savingSchedule, setSavingSchedule] = useState(false)

  const getHeadersOrNotify = async (isJson = false) => {
    const headers = await getAuthHeaders(isJson)
    if (headers) {
      return headers
    }
    toast.error("פג תוקף ההתחברות, יש להתחבר מחדש")
    const redirect = encodeURIComponent(`${pathname}?${searchParams.toString()}`)
    router.replace(`/admin?redirect=${redirect}`)
    return null
  }

  useEffect(() => {
    if (isCheckingAuth || isAuthenticated) {
      return
    }
    const redirect = encodeURIComponent(`${pathname}?${searchParams.toString()}`)
    router.replace(`/admin?redirect=${redirect}`)
  }, [isCheckingAuth, isAuthenticated, pathname, router, searchParams])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    params.set("view", viewType)
    if (selectedDate) {
      params.set("date", selectedDate)
    } else {
      params.delete("date")
    }
    params.set("month", format(currentMonth, "yyyy-MM"))
    router.replace(`/admin/schedules?${params.toString()}`, { scroll: false })
  }, [currentMonth, isAuthenticated, router, searchParams, selectedDate, viewType])

  const loadSchedules = async () => {
    setLoadingSchedules(true)
    try {
      const headers = await getHeadersOrNotify()
      if (!headers) {
        return
      }

      const response = await fetch(`/api/admin/schedules?is_private=${viewType === "private"}`, { headers })
      if (!response.ok) {
        toast.error("שגיאה בטעינת לוח זמנים")
        return
      }

      const data = (await response.json()) as WorkshopSchedule[]
      setSchedules(data)
    } catch (error) {
      console.error("Error loading schedules:", error)
      toast.error("שגיאה בטעינת לוח זמנים")
    } finally {
      setLoadingSchedules(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    void loadSchedules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, viewType])

  const saveSchedule = async (scheduleData: Partial<WorkshopSchedule>, { silent = false } = {}) => {
    setSavingSchedule(true)
    try {
      const headers = await getHeadersOrNotify(true)
      if (!headers) {
        return
      }

      const response = await fetch("/api/admin/schedules", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...scheduleData,
          is_private: viewType === "private",
        }),
      })

      if (!response.ok) {
        if (!silent) toast.error(`שגיאה בשמירת לוח זמנים ל-${scheduleData.date}`)
        return
      }

      await loadSchedules()
      if (!silent) toast.success(`לוח זמנים ל-${scheduleData.date} נשמר בהצלחה`)
    } catch (error) {
      console.error("Error saving schedule:", error)
      if (!silent) toast.error(`שגיאה בשמירת לוח זמנים ל-${scheduleData.date}`)
    } finally {
      setSavingSchedule(false)
    }
  }

  const deleteSchedule = async (date: string) => {
    if (!confirm("האם למחוק את התאריך?")) {
      return
    }

    try {
      const headers = await getHeadersOrNotify()
      if (!headers) {
        return
      }

      const response = await fetch(`/api/admin/schedules?date=${date}&is_private=${viewType === "private"}`, {
        method: "DELETE",
        headers,
      })

      if (!response.ok) {
        toast.error(`שגיאה במחיקת לוח זמנים ל-${date}`)
        return
      }

      await loadSchedules()
      toast.success(`לוח זמנים ל-${date} נמחק בהצלחה`)
    } catch (error) {
      console.error("Error deleting schedule:", error)
      toast.error(`שגיאה במחיקת לוח זמנים ל-${date}`)
    }
  }

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })
    const firstDayOfWeek = getDay(start)
    const paddingDays = Array.from({ length: firstDayOfWeek }, (_, index) => ({
      date: null as Date | null,
      dateStr: `padding-${index}`,
      schedule: null as WorkshopSchedule | null,
      isPadding: true,
    }))
    const actualDays = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd")
      return {
        date: day,
        dateStr,
        schedule: schedules.find((s) => s.date === dateStr) || null,
        isPadding: false,
      }
    })
    return [...paddingDays, ...actualDays]
  }, [currentMonth, schedules])

  const selectedSchedule = schedules.find((s) => s.date === selectedDate)

  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <AdminShell title="דשבורד ניהול" onLogout={signOut}>
      <section className="space-y-6">
        <div className="flex rounded-xl p-1 shadow-sm border max-w-md bg-white">
          <button
            onClick={() => setViewType("private")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              viewType === "private" ? "bg-green-100 text-green-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Users className="w-4 h-4 inline ml-2" />
            סדנאות פרטיות
          </button>
          <button
            onClick={() => setViewType("public")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              viewType === "public" ? "bg-blue-100 text-blue-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Calendar className="w-4 h-4 inline ml-2" />
            סדנאות קבוצתיות
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  →
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentMonth.toLocaleDateString("he-IL", { month: "long", year: "numeric" })}
                </h2>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ←
                </button>
              </div>

              {loadingSchedules && (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto" />
                  <p className="text-gray-600 mt-2">טוען נתונים...</p>
                </div>
              )}

              {!loadingSchedules && (
                <div className="p-6">
                  <div className="grid grid-cols-7 gap-3">
                    {["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"].map((day) => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}

                    {calendarDays.map(({ date, dateStr, schedule, isPadding }) => {
                      if (isPadding) {
                        return <div key={dateStr} className="h-24" />
                      }

                      const isSelected = selectedDate === dateStr
                      const isUnavailable = schedule?.workshop === "unavailable"
                      const hasSchedule = Boolean(schedule && schedule.hours.length > 0)
                      const isToday = format(new Date(), "yyyy-MM-dd") === dateStr

                      return (
                        <div
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`
                            p-3 h-24 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md
                            ${isSelected ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200"}
                            ${isUnavailable ? "bg-red-50 border-red-200" : ""}
                            ${hasSchedule && !isUnavailable ? "bg-green-50 border-green-200" : ""}
                            ${isToday ? "ring-2 ring-blue-300" : ""}
                            ${!hasSchedule && !isUnavailable ? "hover:bg-gray-50" : ""}
                          `}
                        >
                          <div className="flex justify-between items-start">
                            <div className={`text-sm font-semibold ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                              {format(date!, "d")}
                            </div>
                            {isToday && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          </div>

                          {schedule && (
                            <div className="mt-1 space-y-1">
                              <div className="text-xs text-gray-600 flex items-center">
                                <Clock className="w-3 h-3 ml-1" />
                                {schedule.hours.length} שעות
                              </div>
                              <div
                                className={`text-xs px-2 py-1 rounded-lg font-medium ${
                                  schedule.workshop === "unavailable"
                                    ? "bg-red-100 text-red-700"
                                    : schedule.workshop === "family"
                                      ? "bg-blue-100 text-blue-700"
                                      : schedule.workshop === "tech"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                              >
                                {WORKSHOP_TYPES[schedule.workshop as keyof typeof WORKSHOP_TYPES]}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {selectedDate ? (
              <ScheduleEditor
                date={selectedDate}
                schedule={selectedSchedule}
                viewType={viewType}
                onSave={saveSchedule}
                onDelete={() => void deleteSchedule(selectedDate)}
                saving={savingSchedule}
              />
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">בחר תאריך</h3>
                <p className="text-gray-600">לחץ על תאריך בלוח השנה כדי לערוך</p>
              </div>
            )}

            <QuickActionsPanel onSave={saveSchedule} viewType={viewType} loading={savingSchedule} />
          </div>
        </div>
      </section>
    </AdminShell>
  )
}

function ScheduleEditor({
  date,
  schedule,
  viewType,
  onSave,
  onDelete,
  saving,
}: {
  date: string
  schedule?: WorkshopSchedule
  viewType: ViewType
  onSave: (data: Partial<WorkshopSchedule>) => Promise<void>
  onDelete: () => void
  saving: boolean
}) {
  const [hours, setHours] = useState<string[]>(schedule?.hours || [])
  const [workshop, setWorkshop] = useState(schedule?.workshop || "advanced")
  const [isAvailable, setIsAvailable] = useState(schedule ? schedule.workshop !== "unavailable" : true)

  useEffect(() => {
    setHours(schedule?.hours || [])
    setWorkshop(schedule?.workshop || "advanced")
    setIsAvailable(schedule ? schedule.workshop !== "unavailable" : true)
  }, [schedule, date])

  const handleHourToggle = (hour: string) => {
    if (hours.includes(hour)) {
      setHours(hours.filter((h) => h !== hour))
    } else {
      setHours([...hours, hour].sort())
    }
  }

  const handleSave = () => {
    const hasHours = hours.length > 0
    const finalAvailable = isAvailable && hasHours

    let workshopType = "advanced"
    if (!finalAvailable) {
      workshopType = "unavailable"
    } else if (viewType === "private") {
      workshopType = "advanced"
    } else {
      workshopType = workshop === "unavailable" ? "advanced" : workshop
    }

    void onSave({
      date,
      hours: finalAvailable ? hours : [],
      workshop: workshopType,
    })
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">עריכת {date}</h3>
        {schedule && (
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="מחק תאריך"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">זמינות</label>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => setIsAvailable(true)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                isAvailable
                  ? "bg-green-100 text-green-800 border-2 border-green-200"
                  : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
              }`}
            >
              זמין
            </button>
            <button
              onClick={() => setIsAvailable(false)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                !isAvailable
                  ? "bg-red-100 text-red-800 border-2 border-red-200"
                  : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
              }`}
            >
              לא זמין
            </button>
          </div>
        </div>

        {isAvailable && (
          <>
            {viewType === "public" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">סוג סדנה</label>
                <select
                  value={workshop}
                  onChange={(e) => setWorkshop(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="advanced">מתקדמת</option>
                  <option value="tech">טכניקות</option>
                  <option value="family">משפחתית</option>
                </select>
              </div>
            )}

            {viewType === "private" && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                  <span className="text-sm font-medium text-green-800">
                    סוג סדנה: מתקדמת (קבוע לסדנאות פרטיות)
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">שעות זמינות</label>
              <div className="space-y-3">
                {(viewType === "private" ? PRIVATE_HOURS : PUBLIC_HOURS).map((hour) => (
                  <label
                    key={hour}
                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      hours.includes(hour)
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={hours.includes(hour)}
                      onChange={() => handleHourToggle(hour)}
                      className="rounded text-green-600 ml-3"
                    />
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 ml-2" />
                      <span className="font-medium">{hour}</span>
                      <span className="text-xs text-gray-500 mr-2">(ברירת מחדל)</span>
                    </div>
                  </label>
                ))}

                {hours
                  .filter((hour) => !(viewType === "private" ? PRIVATE_HOURS : PUBLIC_HOURS).includes(hour))
                  .map((hour) => (
                    <label
                      key={hour}
                      className="flex items-center p-3 rounded-xl border-2 border-blue-300 bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => handleHourToggle(hour)}
                        className="rounded text-blue-600 ml-3"
                      />
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-blue-400 ml-2" />
                        <span className="font-medium">{hour}</span>
                        <span className="text-xs text-blue-600 mr-2">(מותאם אישית)</span>
                      </div>
                    </label>
                  ))}

                <CustomHourAdder
                  onAddHour={(hour) => {
                    if (!hours.includes(hour)) {
                      setHours([...hours, hour].sort())
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-4 px-6 rounded-xl font-medium transition-all ${
            saving
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
          }`}
        >
          {saving ? "שומר..." : "שמור שינויים"}
        </button>
      </div>
    </div>
  )
}

function CustomHourAdder({ onAddHour }: { onAddHour: (hour: string) => void }) {
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("11:00")
  const [showForm, setShowForm] = useState(false)
  const toast = useAppToast()

  const generateTimeOptions = () => {
    const times: string[] = []
    for (let hour = 8; hour <= 23; hour++) {
      times.push(`${hour.toString().padStart(2, "0")}:00`)
      if (hour < 23) times.push(`${hour.toString().padStart(2, "0")}:30`)
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  const handleAddHour = () => {
    const customHour = `${startTime}-${endTime}`

    const [startH, startM] = startTime.split(":").map(Number)
    const [endH, endM] = endTime.split(":").map(Number)
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    if (startMinutes >= endMinutes) {
      toast.error("שעת התחלה חייבת להיות קודם לשעת הסיום")
      return
    }

    onAddHour(customHour)
    setShowForm(false)
    setStartTime("08:00")
    setEndTime("11:00")
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800"
      >
        <Plus className="w-4 h-4 ml-2" />
        הוסף שעות מותאמות אישית
      </button>
    )
  }

  return (
    <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-gray-700">הוסף שעות חדשות</span>
        <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">שעת התחלה</label>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-sm"
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">שעת סיום</label>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-sm"
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleAddHour}
        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        הוסף {startTime}-{endTime}
      </button>
    </div>
  )
}

function QuickActionsPanel({
  onSave,
  viewType,
  loading,
}: {
  onSave: (data: Partial<WorkshopSchedule>, opts?: { silent?: boolean }) => Promise<void>
  viewType: ViewType
  loading: boolean
}) {
  const [bulkLoading, setBulkLoading] = useState(false)
  const toast = useAppToast()

  const addWeekdays = async () => {
    if (!confirm("להוסיף ימי חול לחודש הבא? זה יוסיף את כל ימי העבודה הזמינים.")) return

    setBulkLoading(true)
    try {
      const startDate = new Date()
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      const promises: Promise<void>[] = []
      let addedCount = 0

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const day = d.getDay()
        const shouldSkip = day === 6 || (viewType === "public" && day === 0)

        if (!shouldSkip) {
          const hours = day === 5 ? ["11:00-14:00"] : viewType === "private" ? PRIVATE_HOURS : PUBLIC_HOURS
          promises.push(
            onSave({
              date: format(d, "yyyy-MM-dd"),
              hours,
              workshop: "advanced",
            }, { silent: true })
          )
          addedCount++
        }
      }

      await Promise.all(promises)
      toast.success(`נוספו ${addedCount} ימי עבודה לחודש הבא!`)
    } catch (error) {
      console.error("Error adding weekdays:", error)
      toast.error("שגיאה בהוספת ימים, נסה שוב")
    } finally {
      setBulkLoading(false)
    }
  }

  const isDisabled = loading || bulkLoading

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">פעולות מהירות</h3>
      <div className="space-y-3">
        <button
          onClick={addWeekdays}
          disabled={isDisabled}
          className={`w-full text-right p-4 rounded-xl transition-all flex items-center justify-between ${
            isDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center">
            <Plus className="w-4 h-4 ml-2" />
            <span>הוסף ימי חול - חודש הבא</span>
          </div>
          <Calendar className="w-4 h-4" />
        </button>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
          <div className="flex items-start">
            <Settings className="w-4 h-4 text-gray-500 ml-2 mt-0.5" />
            <div className="text-xs text-gray-600">
              <div className="font-medium mb-1">כללי הוספה:</div>
              <div className="space-y-1">
                <div>• דילוג על שבתות</div>
                <div>• {viewType === "public" ? "דילוג על ימי ראשון" : "כולל ימי ראשון"}</div>
                <div>• ימי שישי: רק בוקר (11:00-14:00)</div>
                <div>• שאר הימים: כל השעות</div>
              </div>
            </div>
          </div>
        </div>
        {bulkLoading && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2" />
            <span className="text-blue-800 text-sm">מוסיף תאריכים...</span>
          </div>
        )}
      </div>
    </div>
  )
}
