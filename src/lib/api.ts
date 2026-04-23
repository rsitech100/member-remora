import { getAuthToken, removeAuthToken } from './auth'

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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      cache: 'no-store',
    })

    const responseText = await response.text().catch(() => '')

    let responseJson: unknown = null
    try {
      responseJson = responseText ? JSON.parse(responseText) : null
    } catch {
      responseJson = responseText
    }

    if (!response.ok) {
      const apiError = new APIError(
        response.status,
        response.statusText,
        endpoint,
        responseText
      )
      
      if (apiError.isAuthError()) {
        await removeAuthToken().catch(() => {})
      }
      
      throw apiError
    }

    return responseJson as T
  } catch (error) {
    if (error instanceof APIError || (error && typeof error === 'object' && 'digest' in error)) {
      throw error
    }
    
    throw new Error(`Network error: Unable to reach ${endpoint}`)
  }
}

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, options)
}
