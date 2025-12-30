import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/login', '/api/']
const protectedPaths = ['/dashboard', '/course', '/admin']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  if (pathname === '/login') {
    return NextResponse.next()
  }

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
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
