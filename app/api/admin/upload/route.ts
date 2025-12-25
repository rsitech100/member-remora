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

    const formData = await request.formData()

    const response = await fetch(`${API_BASE_URL}/api/upload-original`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}
