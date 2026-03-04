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
    
    const memberUrl = process.env.NEXT_PUBLIC_MEMBER_APP_URL
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL
    
    const host = request.headers.get('host') || ''
    const isMemberApp = !memberUrl || memberUrl.includes(host)
    
    if (!isMemberApp && memberUrl) {
      return NextResponse.redirect(`${memberUrl}/api/logout`)
    }
    
    const proto = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https://') ? 'https' : 'http')
    const baseUrl = host ? `${proto}://${host}` : request.url
    return NextResponse.redirect(new URL('/login', baseUrl))
  } catch (error) {
    const host = request.headers.get('host') || ''
    const proto = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https://') ? 'https' : 'http')
    const baseUrl = host ? `${proto}://${host}` : request.url
    return NextResponse.redirect(new URL('/login', baseUrl))
  }
}

export async function POST(request: NextRequest) {
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
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 })
  }
}
