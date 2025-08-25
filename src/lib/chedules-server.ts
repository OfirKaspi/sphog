import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'
import { WorkshopType, WorkshopDate } from '@/types/workshop'

function convertToWorkshopType(dbWorkshop: string): WorkshopType {
  switch (dbWorkshop.toLowerCase()) {
    case 'family': return WorkshopType.FAMILY
    case 'tech': return WorkshopType.TECH
    case 'advanced': return WorkshopType.ADVANCED
    case 'unavailable': return WorkshopType.UNAVAILABLE
    default: return WorkshopType.ADVANCED
  }
}

async function fetchSchedulesFromDB(isPrivate: boolean): Promise<WorkshopDate[]> {
  const { data, error } = await supabase
    .from('workshop_schedules')
    .select('*')
    .eq('is_private', isPrivate)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching schedules:', error)
    return []
  }

  return data.map(schedule => ({
    date: new Date(schedule.date),
    hours: schedule.hours,
    workshop: convertToWorkshopType(schedule.workshop)
  }))
}

// Cached functions with Next.js 15 cache
export const getPrivateSchedulesCached = unstable_cache(
  async () => fetchSchedulesFromDB(true),
  ['private-schedules'],
  {
    revalidate: 300, // 5 minutes
    tags: ['private-schedules']
  }
)

export const getPublicSchedulesCached = unstable_cache(
  async () => fetchSchedulesFromDB(false),
  ['public-schedules'],
  {
    revalidate: 300, // 5 minutes
    tags: ['public-schedules']
  }
)