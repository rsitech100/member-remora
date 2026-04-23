import { NextRequest, NextResponse } from 'next/server'

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function getMessage(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined
  const msg = value.message
  return typeof msg === 'string' ? msg : undefined
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

    const { searchParams } = new URL(request.url)
    const redirectUri = searchParams.get('redirect_uri')
    
    const backendUrl = redirectUri 
      ? `${apiUrl}/api/auth/discord?redirect_uri=${encodeURIComponent(redirectUri)}`
      : `${apiUrl}/api/auth/discord`

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    const responseText = await response.text().catch(() => '')
    let data: unknown = null
    try {
      data = responseText ? JSON.parse(responseText) : null
    } catch {
      data = { success: false, message: responseText }
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to initiate Discord login',
          message: getMessage(data) || 'Discord OAuth initiation failed',
          details: data,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to connect to authentication service',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
