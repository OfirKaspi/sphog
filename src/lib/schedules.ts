// lib/schedules.ts
import { supabase } from './supabase'
import { WorkshopSchedule } from '@/types/workshop'
import { getPrivateSchedules, getPublicSchedules, invalidateScheduleCache } from './scheduleCache'

// Public functions that use cache
export { getPrivateSchedules, getPublicSchedules }

// Admin functions for dashboard (no cache, always fresh)
export async function getAllSchedulesForAdmin(isPrivate: boolean): Promise<WorkshopSchedule[]> {
  const { data, error } = await supabase
    .from('workshop_schedules')
    .select('*')
    .eq('is_private', isPrivate)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching admin schedules:', error)
    return []
  }

  return data
}

export async function upsertSchedule(schedule: {
  date: string
  hours: string[]
  workshop: string
  is_private: boolean
}): Promise<WorkshopSchedule | null> {
  try {
    // First, try to update existing record
    const { data: existingData } = await supabase
      .from('workshop_schedules')
      .select('id')
      .eq('date', schedule.date)
      .eq('is_private', schedule.is_private)
      .single()

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('workshop_schedules')
        .update({
          hours: schedule.hours || [],
          workshop: schedule.workshop || 'advanced',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating schedule:', error)
        return null
      }

      // Invalidate cache after successful update
      invalidateScheduleCache(schedule.is_private)
      return data
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('workshop_schedules')
        .insert({
          date: schedule.date,
          hours: schedule.hours || [],
          workshop: schedule.workshop || 'advanced',
          is_private: schedule.is_private,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error inserting schedule:', error)
        return null
      }

      // Invalidate cache after successful insert
      invalidateScheduleCache(schedule.is_private)
      return data
    }
  } catch (error) {
    console.error('Error in upsertSchedule:', error)
    return null
  }
}

export async function deleteSchedule(date: string, isPrivate: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('workshop_schedules')
      .delete()
      .eq('date', date)
      .eq('is_private', isPrivate)

    if (error) {
      console.error('Error deleting schedule:', error)
      return false
    }

    // Invalidate cache after successful delete
    invalidateScheduleCache(isPrivate)

    return true
  } catch (error) {
    console.error('Error in deleteSchedule:', error)
    return false
  }
}

// Bulk operations for quick actions
export async function addWeekdaysToSchedule(
  startDate: Date, 
  endDate: Date, 
  isPrivate: boolean
): Promise<number> {
  const promises = []
  let addedCount = 0

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const day = d.getDay()
    
    // Skip Saturday (6) for both, Skip Sunday (0) for public workshops only
    const shouldSkip = day === 6 || (!isPrivate && day === 0)
    
    if (!shouldSkip) {
      // Friday gets only morning slot, other days get all slots
      const hours = day === 5 
        ? ['11:00-14:00'] 
        : ['11:00-14:00', '14:30-17:30', '18:30-21:30']
      
      promises.push(upsertSchedule({
        date: d.toISOString().split('T')[0],
        hours,
        workshop: 'advanced',
        is_private: isPrivate
      }))
      
      addedCount++
    }
  }
  
  await Promise.all(promises)
  return addedCount
}

// Utility function to get schedule statistics
export async function getScheduleStats(isPrivate: boolean): Promise<{
  totalDates: number
  availableDates: number
  unavailableDates: number
  totalTimeSlots: number
}> {
  const schedules = await getAllSchedulesForAdmin(isPrivate)
  
  const stats = {
    totalDates: schedules.length,
    availableDates: schedules.filter(s => s.workshop !== 'unavailable').length,
    unavailableDates: schedules.filter(s => s.workshop === 'unavailable').length,
    totalTimeSlots: schedules.reduce((sum, s) => sum + s.hours.length, 0)
  }

  return stats
}