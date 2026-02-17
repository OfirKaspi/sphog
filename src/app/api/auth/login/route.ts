import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  await request.json().catch(() => null)
  return NextResponse.json(
    { error: 'Deprecated endpoint. Use Supabase Auth signInWithPassword.' },
    { status: 410 }
  )
}

export async function GET() {
  return NextResponse.json(
    { error: 'Deprecated endpoint. Use Supabase Auth signInWithPassword.' },
    { status: 410 }
  )
}