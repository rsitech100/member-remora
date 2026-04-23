import { NextRequest, NextResponse } from 'next/server'

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

function getBackendBaseUrl(request: NextRequest): string | null {
  const host = request.headers.get('host')
  const proto =
    request.headers.get('x-forwarded-proto') ||
    (request.url.startsWith('https://') ? 'https' : 'http')
  const currentOrigin = host ? `${proto}://${host}` : null

  const candidates = [
    process.env.API_BASE_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
  ].filter(Boolean) as string[]

  for (const candidate of candidates) {
    const trimmed = candidate.replace(/\/$/, '')
    try {
      const origin = new URL(trimmed).origin
      if (currentOrigin && origin === currentOrigin) {
        continue
      }
      return trimmed
    } catch {
      continue
    }
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing parameters',
          message: 'Authorization code and state are required',
        },
        { status: 400 }
      )
    }

    const apiUrl = getBackendBaseUrl(request)

    if (!apiUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Configuration error',
          message: 'Backend API URL not configured (set `API_BASE_URL` to your backend, not this Next.js app).',
        },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${apiUrl}/api/auth/discord/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )

    const responseText = await response.text().catch(() => '')
    let data: unknown = null
    try {
      data = responseText ? JSON.parse(responseText) : null
    } catch {
      data = { success: false, message: responseText }
    }

    const token = getToken(data)
    const success = isRecord(data) && data.success === true

    if (success && token) {
      const isSecure = request.url.startsWith('https://')

      const res = NextResponse.json(data, { status: 200 })

      res.cookies.set('auth_token', token, {
        httpOnly: false,
        secure: isSecure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })

      return res
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to complete Discord authentication',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
