import { NextRequest, NextResponse } from 'next/server'
import { setAuthToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      )
    }

    await setAuthToken(token)

    return NextResponse.json({ success: true, message: 'Token set successfully' })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to set token' },
      { status: 500 }
    )
  }
}