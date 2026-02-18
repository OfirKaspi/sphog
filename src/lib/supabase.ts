import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}
const ensuredSupabaseUrl = supabaseUrl
const ensuredSupabaseAnonKey = supabaseAnonKey

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
        Relationships: []
      }
      catalog_products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          price: number
          original_price: number | null
          currency: string
          image_url: string
          image_public_id: string | null
          image_alt: string
          gallery_images: Array<{ url: string; public_id: string }> | null
          in_stock: boolean
          is_promo: boolean
          show_on_home: boolean
          show_in_regular: boolean
          show_in_discount: boolean
          is_hidden: boolean
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string
          price: number
          original_price?: number | null
          currency?: string
          image_url: string
          image_public_id?: string | null
          image_alt?: string
          gallery_images?: Array<{ url: string; public_id: string }> | null
          in_stock?: boolean
          is_promo?: boolean
          show_on_home?: boolean
          show_in_regular?: boolean
          show_in_discount?: boolean
          is_hidden?: boolean
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string
          price?: number
          original_price?: number | null
          currency?: string
          image_url?: string
          image_public_id?: string | null
          image_alt?: string
          gallery_images?: Array<{ url: string; public_id: string }> | null
          in_stock?: boolean
          is_promo?: boolean
          show_on_home?: boolean
          show_in_regular?: boolean
          show_in_discount?: boolean
          is_hidden?: boolean
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          user_id: string
          role: "admin"
          created_at: string
        }
        Insert: {
          user_id: string
          role: "admin"
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: "admin"
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const supabase = createClient<Database>(ensuredSupabaseUrl, ensuredSupabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowserClient can only be called in the browser")
  }

  if (!browserClient) {
    browserClient = createClient(ensuredSupabaseUrl, ensuredSupabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  return browserClient!
}

export function getSupabaseServiceRoleClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
  }

  return createClient<Database>(ensuredSupabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}