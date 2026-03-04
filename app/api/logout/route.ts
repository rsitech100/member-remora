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
    const loginUrl = memberUrl ? `${memberUrl}/login` : new URL('/login', request.url).toString()
    return NextResponse.redirect(loginUrl)
  } catch (error) {
    const memberUrl = process.env.NEXT_PUBLIC_MEMBER_APP_URL
    const loginUrl = memberUrl ? `${memberUrl}/login` : new URL('/login', request.url).toString()
    return NextResponse.redirect(loginUrl)
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
