/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/QuickActions.tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Calendar, Clock, AlertCircle } from 'lucide-react'

interface QuickActionsPanelProps {
  onSave: (data: any) => void
  viewType: 'private' | 'public'
  loading: boolean
}

export default function QuickActionsPanel({ 
  onSave, 
  viewType, 
  loading 
}: QuickActionsPanelProps) {
  const [bulkLoading, setBulkLoading] = useState(false)

  const addWeekdays = async () => {
    if (!confirm('להוסיף ימי חול לחודש הבא? זה יוסיף את כל ימי העבודה הזמינים.')) return

    setBulkLoading(true)
    try {
      const startDate = new Date()
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
      
      const promises = []
      let addedCount = 0

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const day = d.getDay()
        
        // Skip Saturday (6) for both, Skip Sunday (0) for public workshops only
        const shouldSkip = day === 6 || (viewType === 'public' && day === 0)
        
        if (!shouldSkip) {
          // Friday gets only morning slot, other days get all slots
          const hours = day === 5 
            ? ['11:00-14:00'] 
            : ['11:00-14:00', '14:30-17:30', '18:30-21:30']
          
          promises.push(onSave({
            date: format(d, 'yyyy-MM-dd'),
            hours,
            workshop: 'advanced'
          }))
          
          addedCount++
        }
      }
      
      await Promise.all(promises)
      alert(`נוספו ${addedCount} ימי עבודה לחודש הבא!`)
    } catch (error) {
      console.error('Error adding weekdays:', error)
      alert('שגיאה בהוספת ימים')
    } finally {
      setBulkLoading(false)
    }
  }

  const addCurrentWeek = async () => {
    if (!confirm('להוסיף את השבוע הנוכחי?')) return

    setBulkLoading(true)
    try {
      const today = new Date()
      const promises = []
      let addedCount = 0

      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const day = date.getDay()
        
        // Apply same skip logic
        const shouldSkip = day === 6 || (viewType === 'public' && day === 0)
        
        if (!shouldSkip) {
          const hours = day === 5 
            ? ['11:00-14:00'] 
            : ['11:00-14:00', '14:30-17:30', '18:30-21:30']
          
          promises.push(onSave({
            date: format(date, 'yyyy-MM-dd'),
            hours,
            workshop: 'advanced'
          }))
          
          addedCount++
        }
      }
      
      await Promise.all(promises)
      alert(`נוספו ${addedCount} ימים השבוע!`)
    } catch (error) {
      console.error('Error adding week:', error)
      alert('שגיאה בהוספת השבוע')
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

        <button
          onClick={addCurrentWeek}
          disabled={isDisabled}
          className={`w-full text-right p-4 rounded-xl transition-all flex items-center justify-between ${
            isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 hover:border-green-300'
          }`}
        >
          <div className="flex items-center">
            <Plus className="w-4 h-4 ml-2" />
            <span>הוסף השבוע הנוכחי</span>
          </div>
          <Clock className="w-4 h-4" />
        </button>

        {/* Business Rules Info */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 text-gray-500 ml-2 mt-0.5" />
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