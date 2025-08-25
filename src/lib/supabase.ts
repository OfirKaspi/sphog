// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // We don't need user sessions for admin tool
  },
})

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      workshop_schedules: {
        Row: {
          id: number
          date: string
          hours: string[]
          workshop: string
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          hours: string[]
          workshop?: string
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          hours?: string[]
          workshop?: string
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}