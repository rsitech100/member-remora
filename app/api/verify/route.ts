import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone_number, verification_code } = body

    if (!phone_number || !verification_code) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Phone number and verification code are required', 
          message: 'Phone number and verification code are required' 
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

    const response = await fetch(`${apiUrl}/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number, verification_code }),
    })

    const data = await response.json()

    if (data.success && data.data?.token) {
      const res = NextResponse.json(data, { status: response.status })
      
      res.cookies.set('auth_token', data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
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
        message: 'Failed to verify OTP' 
      },
      { status: 500 }
    )
  }
}
