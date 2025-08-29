/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'
import { Calendar, Clock, Users, Settings, LogOut, Shield, Plus, Trash2 } from 'lucide-react'
import { WorkshopSchedule } from '@/types/workshop'
import { useAppToast } from '@/hooks/useAppToast'

// const AVAILABLE_HOURS = ['11:00-14:00', '14:30-17:30', '18:30-21:30']
const PRIVATE_HOURS = ['11:00-14:00', '14:30-17:30', '18:30-21:30']
const PUBLIC_HOURS = ['11:00-14:00', '17:30-20:30', '18:00-21:00']

const WORKSHOP_TYPES = {
  family: 'משפחתית',
  tech: 'טכניקות',
  advanced: 'מתקדמת',
  unavailable: 'לא זמין'
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [schedules, setSchedules] = useState<WorkshopSchedule[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [viewType, setViewType] = useState<'private' | 'public'>('private')
  const [saving, setSaving] = useState(false)
  const [authError, setAuthError] = useState('')
  const toast = useAppToast();


  // Check for existing token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken')
      if (token) {
        setAuthToken(token)
        setIsAuthenticated(true)
        loadSchedules()
      }
    }
  }, [])

  // Auth
  const authenticate = async () => {
    setAuthError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok) {
        setAuthToken(data.token)
        localStorage.setItem('adminToken', data.token)
        setIsAuthenticated(true)
        setPassword('')
        loadSchedules()
      } else {
        setAuthError(data.error || 'שגיאה בהתחברות')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setAuthError('שגיאה בהתחברות')
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setAuthToken('')
    setSchedules([])
    setSelectedDate('')
  }

  // Load schedules
  const loadSchedules = async () => {
    if (!authToken) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/schedules?is_private=${viewType === 'private'}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })

      if (response.ok) {
        const data = await response.json()
        setSchedules(data)
      } else if (response.status === 401) {
        logout()
      }
    } catch (error) {
      console.error('Error loading schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  // Save schedule
  const saveSchedule = async (scheduleData: Partial<WorkshopSchedule>) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...scheduleData,
          is_private: viewType === 'private'
        })
      })

      if (response.ok) {
        await loadSchedules()
        toast.success('נשמר בהצלחה!')
      } else if (response.status === 401) {
        logout()
      } else {
        toast.error('שגיאה בשמירה')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('שגיאה בשמירה')
    } finally {
      setSaving(false)
    }
  }

  // Delete schedule
  const deleteSchedule = async (date: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק?')) return

    try {
      const response = await fetch(`/api/admin/schedules?date=${date}&is_private=${viewType === 'private'}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      })

      if (response.ok) {
        await loadSchedules()
        setSelectedDate('')
        toast.success('נמחק בהצלחה!')
      } else if (response.status === 401) {
        logout()
      }
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('שגיאה במחיקה')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadSchedules()
    }
  }, [viewType, isAuthenticated, authToken])

  // Get calendar data with proper Hebrew week alignment
  const getCalendarDays = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = getDay(start)

    // Create padding days to align calendar properly
    const paddingDays = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      paddingDays.push({
        date: null,
        dateStr: `padding-${i}`,
        schedule: null,
        isPadding: true
      })
    }

    // Add actual days
    const actualDays = days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const schedule = schedules.find(s => s.date === dateStr)
      return {
        date: day,
        dateStr,
        schedule,
        isPadding: false
      }
    })

    return [...paddingDays, ...actualDays]
  }

  // Auth screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-green-100" dir="rtl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">כניסה למנהל</h1>
            <p className="text-gray-600 mt-2">ניהול לוח זמנים סדנאות טרריום</p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="סיסמת מנהל"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && authenticate()}
                className="w-full border border-gray-300 p-4 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {authError && (
                <p className="text-red-600 text-sm mt-2">{authError}</p>
              )}
            </div>

            <button
              onClick={authenticate}
              disabled={!password.trim()}
              className="w-full bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              כניסה למערכת
            </button>

            <div className="text-xs text-gray-500 text-center">
              הגנת אבטחה: 5 ניסיונות כושלים = נעילה ל-15 דקות
            </div>
          </div>
        </div>
      </div>
    )
  }

  const calendarDays = getCalendarDays()
  const selectedSchedule = schedules.find(s => s.date === selectedDate)

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ניהול לוח זמנים</h1>
                <p className="text-gray-600">סדנאות טרריום</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              <span>יציאה</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Workshop Type Toggle */}
        <div className="mb-8">
          <div className="flex bg-white rounded-xl p-1 shadow-sm border max-w-md">
            <button
              onClick={() => setViewType('private')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${viewType === 'private'
                ? 'bg-green-100 text-green-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Users className="w-4 h-4 inline ml-2" />
              סדנאות פרטיות
            </button>
            <button
              onClick={() => setViewType('public')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${viewType === 'public'
                ? 'bg-blue-100 text-blue-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Calendar className="w-4 h-4 inline ml-2" />
              סדנאות קבוצתיות
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              {/* Calendar Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  →
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentMonth.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ←
                </button>
              </div>

              {/* Loading state */}
              {loading && (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">טוען נתונים...</p>
                </div>
              )}

              {/* Calendar Grid */}
              {!loading && (
                <div className="p-6">
                  <div className="grid grid-cols-7 gap-3">
                    {/* Hebrew week headers - Sunday first */}
                    {['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'].map(day => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}

                    {/* Calendar days with proper alignment */}
                    {calendarDays.map(({ date, dateStr, schedule, isPadding }) => {
                      if (isPadding) {
                        return <div key={dateStr} className="h-24"></div>
                      }

                      const isSelected = selectedDate === dateStr
                      const isUnavailable = schedule?.workshop === 'unavailable'
                      const hasSchedule = schedule && schedule.hours.length > 0
                      const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr

                      return (
                        <div
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`
                            p-3 h-24 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md
                            ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200'}
                            ${isUnavailable ? 'bg-red-50 border-red-200' : ''}
                            ${hasSchedule && !isUnavailable ? 'bg-green-50 border-green-200' : ''}
                            ${isToday ? 'ring-2 ring-blue-300' : ''}
                            ${!hasSchedule && !isUnavailable ? 'hover:bg-gray-50' : ''}
                          `}
                        >
                          <div className="flex justify-between items-start">
                            <div className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                              {format(date!, 'd')}
                            </div>
                            {isToday && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>

                          {schedule && (
                            <div className="mt-1 space-y-1">
                              <div className="text-xs text-gray-600 flex items-center">
                                <Clock className="w-3 h-3 ml-1" />
                                {schedule.hours.length} שעות
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-lg font-medium ${schedule.workshop === 'unavailable' ? 'bg-red-100 text-red-700' :
                                schedule.workshop === 'family' ? 'bg-blue-100 text-blue-700' :
                                  schedule.workshop === 'tech' ? 'bg-purple-100 text-purple-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
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

          {/* Edit Panel */}
          <div className="space-y-6">
            {selectedDate ? (
              <ScheduleEditor
                date={selectedDate}
                schedule={selectedSchedule}
                viewType={viewType}
                onSave={saveSchedule}
                onDelete={() => deleteSchedule(selectedDate)}
                saving={saving}
              />
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">בחר תאריך</h3>
                <p className="text-gray-600">לחץ על תאריך בלוח השנה כדי לערוך</p>
              </div>
            )}

            {/* Quick Actions */}
            <QuickActionsPanel
              onSave={saveSchedule}
              viewType={viewType}
              loading={saving}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Schedule Editor Component  
function ScheduleEditor({
  date,
  schedule,
  viewType,
  onSave,
  onDelete,
  saving
}: {
  date: string
  schedule?: WorkshopSchedule
  viewType: 'private' | 'public'
  onSave: (data: any) => void
  onDelete: () => void
  saving: boolean
}) {
  const [hours, setHours] = useState<string[]>(schedule?.hours || [])
  const [workshop, setWorkshop] = useState(schedule?.workshop || 'advanced')
  const [isAvailable, setIsAvailable] = useState(schedule ? schedule.workshop !== 'unavailable' : true)

  // Reset form when date changes
  useEffect(() => {
    setHours(schedule?.hours || [])
    setWorkshop(schedule?.workshop || 'advanced')
    setIsAvailable(schedule ? schedule.workshop !== 'unavailable' : true)
  }, [schedule, date])

  const handleHourToggle = (hour: string) => {
    if (hours.includes(hour)) {
      setHours(hours.filter(h => h !== hour))
    } else {
      setHours([...hours, hour].sort())
    }
  }

  const handleSave = () => {
    // Check if no hours are selected - if so, force unavailable
    const hasHours = hours.length > 0
    const finalAvailable = isAvailable && hasHours

    // Determine correct workshop type
    let workshopType
    if (!finalAvailable) {
      workshopType = 'unavailable'
    } else if (viewType === 'private') {
      workshopType = 'advanced'
    } else {
      workshopType = workshop === 'unavailable' ? 'advanced' : workshop
    }

    onSave({
      date,
      hours: finalAvailable ? hours : [],
      workshop: workshopType
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
        {/* Available/Unavailable Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">זמינות</label>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => setIsAvailable(true)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${isAvailable
                ? 'bg-green-100 text-green-800 border-2 border-green-200'
                : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100'
                }`}
            >
              זמין
            </button>
            <button
              onClick={() => setIsAvailable(false)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${!isAvailable
                ? 'bg-red-100 text-red-800 border-2 border-red-200'
                : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100'
                }`}
            >
              לא זמין
            </button>
          </div>
        </div>

        {isAvailable && (
          <>
            {/* Workshop Type - Only for PUBLIC workshops */}
            {viewType === 'public' && (
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

            {/* Private workshop type indicator */}
            {viewType === 'private' && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                  <span className="text-sm font-medium text-green-800">
                    סוג סדנה: מתקדמת (קבוע לסדנאות פרטיות)
                  </span>
                </div>
              </div>
            )}

            {/* Hours */}
            {/* Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">שעות זמינות</label>
              <div className="space-y-3">
                {/* Default hours */}
                {(viewType === 'private' ? PRIVATE_HOURS : PUBLIC_HOURS).map(hour => (
                  <label
                    key={hour}
                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${hours.includes(hour)
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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

                {/* Custom hours (hours that exist in data but aren't in defaults) */}
                {hours.filter(hour =>
                  !(viewType === 'private' ? PRIVATE_HOURS : PUBLIC_HOURS).includes(hour)
                ).map(hour => (
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

                {/* Add custom hour */}
                <CustomHourAdder onAddHour={(hour) => {
                  if (!hours.includes(hour)) {
                    setHours([...hours, hour].sort())
                  }
                }} />
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-4 px-6 rounded-xl font-medium transition-all ${saving
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
            }`}
        >
          {saving ? 'שומר...' : 'שמור שינויים'}
        </button>
      </div>
    </div>
  )
}

// Custom Hour Adder Component
function CustomHourAdder({ onAddHour }: { onAddHour: (hour: string) => void }) {
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('11:00')
  const [showForm, setShowForm] = useState(false)
  const toast = useAppToast();


  // Generate time options in 30-minute intervals from 8:00 to 23:00
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 8; hour <= 23; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 23) times.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  const handleAddHour = () => {
    const customHour = `${startTime}-${endTime}`
    
    // Convert times to minutes for comparison
    const [startH, startM] = startTime.split(':').map(Number)
    const [endH, endM] = endTime.split(':').map(Number)
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM
    
    // Validation: Start time cannot be greater than or equal to end time
    if (startMinutes >= endMinutes) {
      toast.error('שעת התחלה חייבת להיות קודם לשעת הסיום')
      return
    }
    
    onAddHour(customHour)
    setShowForm(false)
    setStartTime('08:00')
    setEndTime('11:00')
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
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
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
            {timeOptions.map(time => (
              <option key={time} value={time}>{time}</option>
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
            {timeOptions.map(time => (
              <option key={time} value={time}>{time}</option>
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

// Quick Actions Component
function QuickActionsPanel({
  onSave,
  viewType,
  loading
}: {
  onSave: (data: any) => void
  viewType: 'private' | 'public'
  loading: boolean
}) {
  const [bulkLoading, setBulkLoading] = useState(false)
  const toast = useAppToast();

  const addWeekdays = async () => {
    if (!confirm('להוסיף ימי חול לחודש הבא? זה יוסיף את כל ימי העבודה הזמינים.')) return

    setBulkLoading(true)
    try {
      const startDate = new Date()
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      const promises = []
      let addedCount = 0

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const day = d.getDay()

        // Skip Saturday (6) for both, Skip Sunday (0) for public workshops only
        const shouldSkip = day === 6 || (viewType === 'public' && day === 0)

        if (!shouldSkip) {
          const hours = day === 5
            ? ['11:00-14:00']
            : (viewType === 'private' ? PRIVATE_HOURS : PUBLIC_HOURS)

          promises.push(onSave({
            date: format(d, 'yyyy-MM-dd'),
            hours,
            workshop: 'advanced'
          }))

          addedCount++
        }
      }

      await Promise.all(promises)
      toast.success(`נוספו ${addedCount} ימי עבודה לחודש הבא!`)
    } catch (error) {
      console.error('Error adding weekdays:', error)
      toast.error('שגיאה בהוספת ימים')
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
          className={`w-full text-right p-4 rounded-xl transition-all flex items-center justify-between ${isDisabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 hover:border-blue-300'
            }`}
        >
          <div className="flex items-center">
            <Plus className="w-4 h-4 ml-2" />
            <span>הוסף ימי חול - חודש הבא</span>
          </div>
          <Calendar className="w-4 h-4" />
        </button>

        {/* Business Rules Info */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
          <div className="flex items-start">
            <Settings className="w-4 h-4 text-gray-500 ml-2 mt-0.5" />
            <div className="text-xs text-gray-600">
              <div className="font-medium mb-1">כללי הוספה:</div>
              <div className="space-y-1">
                <div>• דילוג על שבתות</div>
                <div>• {viewType === 'public' ? 'דילוג על ימי ראשון' : 'כולל ימי ראשון'}</div>
                <div>• ימי שישי: רק בוקר (11:00-14:00)</div>
                <div>• שאר הימים: כל השעות</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {bulkLoading && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
            <span className="text-blue-800 text-sm">מוסיף תאריכים...</span>
          </div>
        )}
      </div>
    </div>
  )
}