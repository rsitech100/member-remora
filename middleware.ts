import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/login', '/api/login', '/api/verify', '/api/logout']
const protectedPaths = ['/dashboard', '/course', '/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|files).*)',
  ],
}
