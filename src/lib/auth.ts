import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { IUser, IDashboardData, IAPIResponse } from '@/types/api'

const AUTH_COOKIE_NAME = 'auth_token'
const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days


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
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
    throw error
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

export async function handleAuthError(): Promise<void> {
  await clientLogout()
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
    console.log('[fetchUserData] No token found')
    return null
  }

  console.log('[fetchUserData] Token exists, fetching from:', API_BASE_URL)

  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    })

    console.log('[fetchUserData] Response status:', response.status, response.statusText)

    if (response.ok) {
      const result = await response.json() as IAPIResponse<IDashboardData>
      console.log('[fetchUserData] Success:', {
        success: result.success,
        hasUser: !!result.data?.user,
        userName: result.data?.user?.name,
        userRole: result.data?.user?.role
      })
      return result.data
    }

    // Log error response body
    const errorText = await response.text().catch(() => 'Unable to read response')
    console.log('[fetchUserData] Error response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    })

    // If 401, 403, or 404 - token is invalid, remove it
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      console.log('[fetchUserData] Invalid token detected, removing...')
      await removeAuthToken().catch(() => {})
    }

    return null
  } catch (error) {
    console.log('[fetchUserData] Exception:', error instanceof Error ? error.message : error)
    return null
  }
}

export async function requireAdmin(): Promise<AuthResult> {
  const token = await getAuthToken()
  
  if (!token) {
    redirect('/login')
  }

  try {
    const dashboardData = await fetchUserData()
    
    if (!dashboardData || !dashboardData.user) {
      await removeAuthToken().catch(() => {})
      redirect('/login')
    }

    const user = dashboardData.user

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      redirect('/dashboard')
    }

    return { user, dashboardData }
  } catch (error) {
    await removeAuthToken().catch(() => {})
    redirect('/login')
  }
}

export async function requireAuth(): Promise<AuthResult> {
  const token = await getAuthToken()
  
  if (!token) {
    redirect('/login')
  }

  try {
    const dashboardData = await fetchUserData()
    
    if (!dashboardData || !dashboardData.user) {
      // Token is invalid, remove it
      await removeAuthToken().catch(() => {})
      redirect('/login')
    }

    return { user: dashboardData.user, dashboardData }
  } catch (error) {
    // Any error during auth check, clean up and redirect
    await removeAuthToken().catch(() => {})
    redirect('/login')
  }
}

export async function requireGuest(): Promise<void> {
  const token = await getAuthToken()
  
  if (token) {
    try {
      const dashboardData = await fetchUserData()
      
      if (dashboardData && dashboardData.user) {
        const user = dashboardData.user
        
        if (user.role === 'admin' || user.role === 'superadmin') {
          redirect('/admin')
        } else {
          redirect('/dashboard')
        }
      } else {
        // Token exists but is invalid, clean it up
        await removeAuthToken().catch(() => {})
      }
    } catch (error) {
      // If there's any error validating token, clean it up
      await removeAuthToken().catch(() => {})
    }
  }
  // If no token or invalid token (cleaned up), allow access to guest page
}

export async function checkAuth(): Promise<AuthCheckResult> {
  const token = await getAuthToken()
  
  if (!token) {
    return { authenticated: false }
  }

  const dashboardData = await fetchUserData()
  
  if (!dashboardData || !dashboardData.user) {
    await removeAuthToken().catch(() => {})
    return { authenticated: false }
  }

  return {
    authenticated: true,
    user: dashboardData.user,
    role: dashboardData.user.role,
  }
}
