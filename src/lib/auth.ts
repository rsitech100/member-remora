import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { IUser, IDashboardData, IAPIResponse } from '@/types/api'

const AUTH_COOKIE_NAME = 'auth_token'
const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const ADMIN_APP_URL = process.env.NEXT_PUBLIC_ADMIN_APP_URL || ''
const MEMBER_APP_URL = process.env.NEXT_PUBLIC_MEMBER_APP_URL || ''


export function getAdminRedirectUrl(token: string): string {
  if (!ADMIN_APP_URL) return '/admin'
  return `${ADMIN_APP_URL}/api/auth/set-token-redirect?token=${encodeURIComponent(token)}&redirect=/admin`
}


export function isAdminApp(): boolean {
  return !ADMIN_APP_URL || ADMIN_APP_URL === MEMBER_APP_URL
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)
    return token?.value || null
  } catch (error) {
    return null
  }
}

export async function setAuthToken(token: string): Promise<void> {
  try {
    const cookieStore = await cookies()
    const isSecure = process.env.COOKIE_SECURE === 'true' || false
    
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: false,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
  } catch (error) {
    throw error
  }
}

export async function removeAuthToken(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE_NAME)
  } catch (error) {
  }
}

export async function clientLogout(): Promise<void> {
  try {
    await fetch('/api/logout', { 
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    // Silently handle logout error
  }
  
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

export interface AuthResult {
  user: IUser
  dashboardData?: IDashboardData
}

export interface AuthCheckResult {
  authenticated: boolean
  user?: IUser
  role?: string
}

async function fetchUserData(): Promise<IDashboardData | null> {
  const token = await getAuthToken()
  
  if (!token) {
    return null
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      cache: 'no-store',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const result = await response.json() as IAPIResponse<IDashboardData>
      return result.data
    }

    // If 401, 403 - token is invalid
    if (response.status === 401 || response.status === 403) {
      await removeAuthToken()
      return null
    }

    return null
  } catch (error) {
    // On any error, assume token is invalid
    await removeAuthToken()
    return null
  }
}

export async function requireAdmin(): Promise<AuthResult> {
  const token = await getAuthToken()
  
  if (!token) {
    redirect('/login')
  }

  const dashboardData = await fetchUserData()
  
  if (!dashboardData?.user) {
    redirect('/login')
  }

  const { user } = dashboardData

  // Check if user is admin
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    redirect('/dashboard')
  }

  return { user, dashboardData }
}

export async function requireAuth(): Promise<AuthResult> {
  const token = await getAuthToken()
  
  if (!token) {
    redirect('/login')
  }

  const dashboardData = await fetchUserData()
  
  if (!dashboardData?.user) {
    redirect('/login')
  }

  const { user } = dashboardData
  
  if (user.role === 'admin' || user.role === 'superadmin') {
    const token = await getAuthToken()
    if (token && ADMIN_APP_URL) {
      redirect(getAdminRedirectUrl(token))
    }
    redirect('/admin')
  }

  return { user, dashboardData }
}

export async function requireGuest(): Promise<void> {
  const token = await getAuthToken()
  
  if (!token) {
    return
  }

  const dashboardData = await fetchUserData()
  
  if (!dashboardData?.user) {
    return
  }

  const { user } = dashboardData
  
  if (user.role === 'admin' || user.role === 'superadmin') {
    const token = await getAuthToken()
    if (token && ADMIN_APP_URL) {
      redirect(getAdminRedirectUrl(token))
    }
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}

export async function checkAuth(): Promise<AuthCheckResult> {
  const token = await getAuthToken()
  
  if (!token) {
    return { authenticated: false }
  }

  const dashboardData = await fetchUserData()
  
  if (!dashboardData?.user) {
    return { authenticated: false }
  }

  return {
    authenticated: true,
    user: dashboardData.user,
    role: dashboardData.user.role,
  }
}
