import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    cookieStore.delete('auth_token')
    
    cookieStore.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
      expires: new Date(0),
    })
    
    return NextResponse.redirect(new URL('/login', request.url))
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    cookieStore.set('auth_token', '', {
      httpOnly: true,
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
