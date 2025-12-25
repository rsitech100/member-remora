import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = await fetchWithAuth('/api/videos', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return NextResponse.json(data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create video'
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}
