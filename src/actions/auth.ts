'use server'

import { cookies } from 'next/headers'
import { fetchWithAuth } from '@/lib/api'
import type { IAPIResponse, IDashboardData } from '@/types/api'
import type { ActionResult } from '@/actions/shared'
import { toActionError } from '@/actions/shared'

type LoginOtpResponse = {
  success: boolean
  message?: string
  error?: string
  expired?: boolean
  status?: number
  details?: string
}

type VerifyOtpResponse = {
  success: boolean
  message?: string
  error?: string
  status?: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function getToken(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined
  const data = value.data
  if (!isRecord(data)) return undefined
  const token = data.token
  return typeof token === 'string' ? token : undefined
}

function getBackendApiUrl(): string | null {
  const candidates = [
    process.env.API_BASE_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
  ].filter(Boolean) as string[]

  for (const candidate of candidates) {
    const trimmed = candidate.replace(/\/$/, '')
    try {
      // validate URL
      new URL(trimmed)
      return trimmed
    } catch {
      continue
    }
  }

  return null
}

export async function requestLoginOtp(phoneNumber: string): Promise<ActionResult<LoginOtpResponse>> {
  try {
    const apiUrl = getBackendApiUrl()
    if (!apiUrl) {
      return { ok: false, message: 'API URL not configured' }
    }

    const response = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber }),
      cache: 'no-store',
    })

    const responseText = await response.text().catch(() => '')
    if (!response.ok) {
      if (response.status === 403) {
        return {
          ok: true,
          data: {
            success: false,
            error: 'Access Expired',
            message: 'Your access has expired',
            expired: true,
            details: responseText,
            status: 403,
          },
        }
      }

      return {
        ok: true,
        data: {
          success: false,
          error: 'API Error',
          message: 'Login request failed',
          details: responseText,
          status: response.status,
        },
      }
    }

    let data: unknown = null
    try {
      data = responseText ? JSON.parse(responseText) : null
    } catch {
      data = null
    }

    if (data && typeof data === 'object') {
      return { ok: true, data: data as LoginOtpResponse }
    }

    return { ok: true, data: { success: true } }
  } catch (error) {
    return toActionError(error, 'Failed to process login request')
  }
}

export async function verifyOtp(phoneNumber: string, verificationCode: string): Promise<ActionResult<VerifyOtpResponse>> {
  try {
    const apiUrl = getBackendApiUrl()
    if (!apiUrl) {
      return { ok: false, message: 'API URL not configured' }
    }

    const response = await fetch(`${apiUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber, verification_code: verificationCode }),
      cache: 'no-store',
    })

    const json: unknown = await response.json().catch(() => null)
    const payload: VerifyOtpResponse = isRecord(json)
      ? (json as VerifyOtpResponse)
      : { success: response.ok, message: response.ok ? 'OK' : 'Failed to verify OTP', status: response.status }

    const token = getToken(json)
    if (payload.success && token) {
      const cookieStore = await cookies()
      const isSecure = process.env.NODE_ENV === 'production'
      cookieStore.set('auth_token', token, {
        httpOnly: false,
        secure: isSecure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    return { ok: true, data: payload }
  } catch (error) {
    return toActionError(error, 'Failed to verify OTP')
  }
}

export async function fetchDashboardRole(): Promise<ActionResult<{ role: string }>> {
  try {
    const response = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
    const role = response?.data?.user?.role
    if (!role) {
      return { ok: false, message: 'Role not available' }
    }
    return { ok: true, data: { role } }
  } catch (error) {
    return toActionError(error, 'Failed to fetch dashboard')
  }
}
