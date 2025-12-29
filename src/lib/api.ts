import { getAuthToken, removeAuthToken } from './auth'
import { redirect } from 'next/navigation'

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL

export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public endpoint: string,
    public responseBody?: string
  ) {
    super(`API Error ${status}: ${statusText}`)
    this.name = 'APIError'
  }

  isAuthError(): boolean {
    return (
      this.status === 401 ||
      this.status === 403 ||
      this.responseBody?.toLowerCase().includes('unauthorized') ||
      this.responseBody?.toLowerCase().includes('token') ||
      this.responseBody?.toLowerCase().includes('session expired') ||
      false
    )
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>
    Object.assign(headers, existingHeaders)
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    console.log('[fetchAPI] Calling:', endpoint, 'with token:', !!token)
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      cache: 'no-store',
    })

    console.log('[fetchAPI] Response:', endpoint, response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.log('[fetchAPI] Error response body:', errorText)
      
      const apiError = new APIError(
        response.status,
        response.statusText,
        endpoint,
        errorText
      )
      
      if (apiError.isAuthError()) {
        console.log('[fetchAPI] Auth error detected, cleaning up token')
        await removeAuthToken().catch(() => {})
        
        if (typeof window !== 'undefined') {
          console.log('[fetchAPI] Client-side, redirecting to login')
          await fetch('/api/logout', { method: 'POST' }).catch(() => {})
          window.location.href = '/login'
          throw apiError
        }
      }
      
      throw apiError
    }

    const data = await response.json()
    console.log('[fetchAPI] Success:', endpoint, { success: data.success, hasData: !!data.data })
    return data
  } catch (error) {
    if (error instanceof APIError || (error && typeof error === 'object' && 'digest' in error)) {
      throw error
    }
    
    console.log('[fetchAPI] Network error:', endpoint, error)
    throw new Error(`Network error: Unable to reach ${endpoint}`)
  }
}

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, options)
}
