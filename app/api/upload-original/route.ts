import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth'

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL

export const dynamic = 'force-dynamic'
// Remove maxDuration to allow long uploads

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
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    // Create a new FormData to send to backend
    const backendFormData = new FormData()
    backendFormData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/api/upload-original`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: backendFormData,
    })

    const responseText = await response.text()
    
    try {
      const data = JSON.parse(responseText)
      return NextResponse.json(data)
    } catch (parseError) {
      return NextResponse.json(
        { success: false, message: 'Invalid response from backend', details: responseText },
        { status: 500 }
      )
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}
