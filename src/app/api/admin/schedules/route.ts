// app/api/admin/schedules/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getAllSchedulesForAdmin, upsertSchedule, deleteSchedule } from '@/lib/schedules'

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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting schedule:', error)
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}