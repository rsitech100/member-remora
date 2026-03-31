import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth'

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!API_BASE_URL) {
      return NextResponse.json(
        { success: false, message: 'API URL not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const currentEmail = typeof body?.current_email === 'string' ? body.current_email.trim() : ''
    const newEmail = typeof body?.new_email === 'string' ? body.new_email.trim() : ''

    if (!currentEmail || !newEmail) {
      return NextResponse.json(
        { success: false, message: 'Current email and new email are required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/api/update-email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        current_email: currentEmail,
        new_email: newEmail,
      }),
      cache: 'no-store',
    })

    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    }

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Email updated successfully',
      })
    }

    const errorText = await response.text()
    return NextResponse.json(
      {
        success: false,
        message: errorText || 'Failed to update email',
      },
      { status: response.status }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update email'
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}
