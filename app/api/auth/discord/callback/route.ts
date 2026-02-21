import { NextRequest, NextResponse } from 'next/server'

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

    const apiUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL

    if (!apiUrl) {
      return NextResponse.json(
        { success: false, error: 'Configuration error', message: 'API URL not configured' },
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

    const data = await response.json()

    if (data.success && data.data?.token) {
      const isSecure = request.url.startsWith('https://')

      const res = NextResponse.json(data, { status: 200 })

      res.cookies.set('auth_token', data.data.token, {
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
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to complete Discord authentication',
      },
      { status: 500 }
    )
  }
}
