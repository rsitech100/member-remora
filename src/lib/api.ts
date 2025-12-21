import { getAuthToken } from './auth'

const API_BASE_URL = process.env.API_BASE_URL || 'https://remora.hla12.xyz'

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    console.error(`API Error ${response.status} for ${endpoint}:`, errorText)
    throw new Error(`API Error: ${response.status} - ${errorText || response.statusText}`)
  }

  return response.json()
}

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, options)
}
