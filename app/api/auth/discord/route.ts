import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL

    if (!apiUrl) {
      return NextResponse.json(
        { success: false, error: 'Configuration error', message: 'API URL not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(`${apiUrl}/api/auth/discord`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to initiate Discord login',
          message: data.message || 'Discord OAuth initiation failed',
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to connect to authentication service',
      },
      { status: 500 }
    )
  }
}
