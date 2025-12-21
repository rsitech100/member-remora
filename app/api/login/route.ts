import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone_number } = body

    if (!phone_number) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required', message: 'Phone number is required' },
        { status: 400 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL
    const response = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number }),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error', 
        message: 'Failed to process login request' 
      },
      { status: 500 }
    )
  }
}
