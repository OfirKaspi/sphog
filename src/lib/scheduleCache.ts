// lib/scheduleCache.ts
import { supabase } from './supabase'
import { WorkshopType, WorkshopDate, CacheEntry } from '@/types/workshop'

class ScheduleCache {
  private cache = new Map<string, CacheEntry>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private getCacheKey(isPrivate: boolean): string {
    return `schedules_${isPrivate ? 'private' : 'public'}`
  }

  private async getLastUpdatedFromDB(isPrivate: boolean): Promise<string> {
    try {
      const { data } = await supabase
        .from('workshop_schedules')
        .select('updated_at')
        .eq('is_private', isPrivate)
        .order('updated_at', { ascending: false })
        .limit(1)

      return data?.[0]?.updated_at || new Date().toISOString()
    } catch (error) {
      console.error('Error getting last updated:', error)
      return new Date().toISOString()
    }
  }

  private convertToWorkshopType(dbWorkshop: string): WorkshopType {
    switch (dbWorkshop.toLowerCase()) {
      case 'family': return WorkshopType.FAMILY
      case 'tech': return WorkshopType.TECH
      case 'advanced': return WorkshopType.ADVANCED
      case 'unavailable': return WorkshopType.UNAVAILABLE
      default: return WorkshopType.ADVANCED
    }
  }

  async getSchedules(isPrivate: boolean): Promise<WorkshopDate[]> {
    const cacheKey = this.getCacheKey(isPrivate)
    const cached = this.cache.get(cacheKey)
    const now = Date.now()

    // Check if cache is still fresh
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      // Verify cache is still valid with database
      const latestUpdate = await this.getLastUpdatedFromDB(isPrivate)
      
      if (latestUpdate <= cached.etag) {
        console.log(`Using cached data for ${isPrivate ? 'private' : 'public'} workshops`)
        return cached.data
      }
    }

    // Fetch fresh data from database
    console.log(`Fetching fresh data for ${isPrivate ? 'private' : 'public'} workshops`)
    return this.fetchAndCache(isPrivate)
  }

  private async fetchAndCache(isPrivate: boolean): Promise<WorkshopDate[]> {
    try {
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

      const transformedData = data.map(schedule => ({
        date: new Date(schedule.date),
        hours: schedule.hours,
        workshop: this.convertToWorkshopType(schedule.workshop)
      }))

      // Get latest update timestamp for cache validation
      const latestUpdate = data.reduce((latest, item) => 
        item.updated_at > latest ? item.updated_at : latest, 
        new Date().toISOString()
      )

      // Cache the data
      const cacheKey = this.getCacheKey(isPrivate)
      this.cache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now(),
        etag: latestUpdate
      })

      return transformedData
    } catch (error) {
      console.error('Error in fetchAndCache:', error)
      return []
    }
  }

  // Force refresh cache (call this after admin updates)
  invalidate(isPrivate?: boolean) {
    if (isPrivate !== undefined) {
      const cacheKey = this.getCacheKey(isPrivate)
      this.cache.delete(cacheKey)
      console.log(`Invalidated cache for ${isPrivate ? 'private' : 'public'} workshops`)
    } else {
      this.cache.clear()
      console.log('Cleared all cache')
    }
  }

  // Get cache stats for debugging
  getCacheStats() {
    const stats = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      ageMinutes: Math.round((Date.now() - entry.timestamp) / 1000 / 60),
      dataSize: entry.data.length,
      lastUpdated: entry.etag
    }))
    return stats
  }

  // Preload cache for better performance
  async preloadCache() {
    await Promise.all([
      this.getSchedules(true),  // Private
      this.getSchedules(false)  // Public
    ])
  }
}

// Singleton instance
export const scheduleCache = new ScheduleCache()

// Public functions that use the cache
export async function getPrivateSchedules(): Promise<WorkshopDate[]> {
  return scheduleCache.getSchedules(true)
}

export async function getPublicSchedules(): Promise<WorkshopDate[]> {
  return scheduleCache.getSchedules(false)
}

// Call this after admin updates to refresh cache
export function invalidateScheduleCache(isPrivate?: boolean) {
  scheduleCache.invalidate(isPrivate)
}

// Preload cache for better initial performance
export async function preloadScheduleCache() {
  return scheduleCache.preloadCache()
}