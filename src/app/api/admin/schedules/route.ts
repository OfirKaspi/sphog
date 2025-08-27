// app/api/admin/schedules/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { revalidatePath } from 'next/cache'
import { getAllSchedulesForAdmin, upsertSchedule, deleteSchedule } from '@/lib/schedules'
import { supabase } from '@/lib/supabase'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

async function checkAuth(request: NextRequest): Promise<boolean> {
  try {
    const authorization = request.headers.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return false
    }

    const token = authorization.split(' ')[1]
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch (error) {
    console.error('Auth verification failed:', error)
    return false
  }
}

// Cleanup function for old schedules
async function cleanupOldSchedules(): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  
  try {
    const { data, error } = await supabase
      .from('workshop_schedules')
      .delete()
      .lt('date', today) // Delete anything before today
      .select('id')

    if (error) {
      console.error('Error cleaning old schedules:', error)
      return 0
    }

    const deletedCount = data?.length || 0
    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old schedule entries`)
    }
    
    return deletedCount
  } catch (error) {
    console.error('Cleanup error:', error)
    return 0
  }
}

export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const isPrivate = searchParams.get('is_private') === 'true'

    const schedules = await getAllSchedulesForAdmin(isPrivate)
    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { date, hours, workshop, is_private } = body

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    const schedule = await upsertSchedule({
      date,
      hours: hours || [],
      workshop: workshop || 'advanced',
      is_private: is_private ?? true
    })

    if (!schedule) {
      return NextResponse.json(
        { error: 'Failed to save schedule' },
        { status: 500 }
      )
    }

    // Run cleanup on every save to remove old dates
    const deletedCount = await cleanupOldSchedules()
    if (deletedCount > 0) {
      console.log(`Auto-cleaned ${deletedCount} past dates`)
    }

    // Force Next.js to revalidate only relevant pages
    try {
      if (is_private) {
        revalidatePath('/private-workshops')
      } else {
        revalidatePath('/public-workshops')
      }
      // Don't revalidate home page since it doesn't have schedule data
    } catch (revalidateError) {
      console.log('Revalidation warning:', revalidateError)
      // Don't fail the request if revalidation fails
    }

    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Error saving schedule:', error)
    return NextResponse.json(
      { error: 'Failed to save schedule' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const isPrivate = searchParams.get('is_private') === 'true'

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    const success = await deleteSchedule(date, isPrivate)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete schedule' },
        { status: 500 }
      )
    }

    // Force Next.js to revalidate only relevant pages
    try {
      if (isPrivate) {
        revalidatePath('/private-workshops')
      } else {
        revalidatePath('/public-workshops')
      }
    } catch (revalidateError) {
      console.log('Revalidation warning:', revalidateError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting schedule:', error)
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    )
  }
}

// New endpoint for manual cleanup
export async function PATCH(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const deletedCount = await cleanupOldSchedules()
    
    // Revalidate pages after cleanup
    try {
      revalidatePath('/private-workshops')
      revalidatePath('/public-workshops')
      revalidatePath('/')
    } catch (revalidateError) {
      console.log('Revalidation warning:', revalidateError)
    }

    return NextResponse.json({ 
      success: true, 
      deletedCount,
      message: `Cleaned up ${deletedCount} old schedule entries`
    })
  } catch (error) {
    console.error('Manual cleanup error:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup old schedules' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}