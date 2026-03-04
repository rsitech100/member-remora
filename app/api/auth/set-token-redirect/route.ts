import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const redirectTo = searchParams.get('redirect') || '/admin'

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isSecure = request.url.startsWith('https://')

  const response = NextResponse.redirect(new URL(redirectTo, request.url))

  response.cookies.set('auth_token', token, {
    httpOnly: false,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return response
}
