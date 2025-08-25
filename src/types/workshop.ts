// types/workshop.ts
export enum WorkshopType {
  FAMILY = "family",
  TECH = "tech",
  ADVANCED = "advanced", 
  UNAVAILABLE = "unavailable",
}

export interface WorkshopSchedule {
  id: number
  date: string
  hours: string[]
  workshop: string
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface WorkshopDate {
  date: Date
  hours: string[]
  workshop: WorkshopType
}

export interface AvailableDate {
  date: Date
  hours: string[]
  workshop: WorkshopType
}

// Admin types
export interface AdminAuthResponse {
  success: boolean
  token?: string
  error?: string
}

export interface CacheEntry {
  data: WorkshopDate[]
  timestamp: number
  etag: string
}