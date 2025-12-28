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

    const apiUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
    
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, error: 'Configuration error', message: 'API URL not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number }),
    })

    const responseText = await response.text()

    if (!response.ok) {
      if (response.status === 403) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Access Expired',
            message: 'Your access has expired',
            expired: true,
            details: responseText,
            status: 403
          },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'API Error',
          message: 'Login request failed',
          details: responseText,
          status: response.status
        },
        { status: response.status }
      )
    }

    const data = JSON.parse(responseText)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error', 
        message: 'Failed to process login request',
        details: errorMessage 
      },
      { status: 500 }
    )
  }
}
