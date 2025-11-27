import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Simple query to keep database connection alive
    // Query the workshop_schedules table to verify DB connectivity
    const { error } = await supabase
      .from('workshop_schedules')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return NextResponse.json({ 
      status: 'alive', 
      timestamp: new Date().toISOString(),
      message: 'Database connection successful',
      database: 'connected'
    }, { status: 200 })
  } catch (error: unknown) {
    console.error('Keepalive error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        status: 'error', 
        message: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Optional: Also handle POST if needed
export async function POST() {
  return GET()
}