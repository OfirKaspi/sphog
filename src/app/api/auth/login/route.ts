// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown'
  return ip
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '900000') // 15 minutes
  const maxAttempts = parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '5')
  
  const record = rateLimitMap.get(key)
  
  if (!record) {
    rateLimitMap.set(key, { attempts: 1, lastAttempt: now })
    return true
  }

  // Reset if window expired
  if (now - record.lastAttempt > windowMs) {
    rateLimitMap.set(key, { attempts: 1, lastAttempt: now })
    return true
  }

  // Check if exceeded max attempts
  if (record.attempts >= maxAttempts) {
    return false
  }

  // Increment attempts
  record.attempts++
  record.lastAttempt = now
  return true
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request)
    
    // Check rate limit
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Try again in 15 minutes.' },
        { status: 429 }
      )
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      )
    }		

    // Validate password
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .setIssuedAt()
      .setSubject('admin')
      .sign(JWT_SECRET)

    // Reset rate limit on successful login
    rateLimitMap.delete(rateLimitKey)

    return NextResponse.json({ 
      success: true, 
      token,
      expiresIn: '24h'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}