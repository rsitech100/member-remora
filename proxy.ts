import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  const publicPaths = ['/api/login', '/api/verify', '/api/logout']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  const isPublicAsset = pathname.startsWith('/_next') || 
                        pathname.startsWith('/images') || 
                        pathname.startsWith('/files') ||
                        pathname === '/favicon.ico'

  if (isPublicPath || isPublicAsset) {
    return NextResponse.next()
  }

  const protectedPaths = ['/dashboard', '/course', '/admin']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}
