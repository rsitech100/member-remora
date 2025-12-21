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
      console.error('API_BASE_URL or NEXT_PUBLIC_BASE_URL is not configured')
      return NextResponse.json(
        { success: false, error: 'Configuration error', message: 'API URL not configured' },
        { status: 500 }
      )
    }

    console.log('Calling API:', `${apiUrl}/api/login`)
    const response = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number }),
    })

    if (!response.ok) {
      console.error('API returned error status:', response.status)
      const errorText = await response.text()
      console.error('API error response:', errorText)
    }

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Login API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    
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
