import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    cookieStore.delete('auth_token')
    
    // Clear with httpOnly false (matching how it was set)
    cookieStore.set('auth_token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
      expires: new Date(0),
    })
    
    const host = request.headers.get('host') || ''
    const proto = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https://') ? 'https' : 'http')
    const baseUrl = host ? `${proto}://${host}` : request.url
    return NextResponse.redirect(new URL('/login', baseUrl))
  } catch {
    const host = request.headers.get('host') || ''
    const proto = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https://') ? 'https' : 'http')
    const baseUrl = host ? `${proto}://${host}` : request.url
    return NextResponse.redirect(new URL('/login', baseUrl))
  }
}

export async function POST() {
  try {
    const cookieStore = await cookies()

    cookieStore.delete('auth_token')
    
    // Clear with httpOnly false (matching how it was set)
    cookieStore.set('auth_token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
      expires: new Date(0),
    })
    
    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  } catch {
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 })
  }
}
