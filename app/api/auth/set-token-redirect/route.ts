import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const redirectTo = searchParams.get('redirect') || '/admin'

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const host = request.headers.get('host') || request.headers.get('x-forwarded-host')
  const proto = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https://') ? 'https' : 'http')
  const baseUrl = host ? `${proto}://${host}` : request.url
  const isSecure = proto === 'https'

  const response = NextResponse.redirect(new URL(redirectTo, baseUrl))

  response.cookies.set('auth_token', token, {
    httpOnly: false,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return response
}
