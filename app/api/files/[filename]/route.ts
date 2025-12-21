import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth'

const API_BASE_URL = process.env.API_BASE_URL || 'https://remora.hla12.xyz'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/files/${filename}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch video file')
    }

    const contentType = response.headers.get('content-type') || 'video/mp4'
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.byteLength.toString(),
        'Accept-Ranges': 'bytes',
      },
    })
  } catch (error) {
    console.error('File proxy error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch file' },
      { status: 500 }
    )
  }
}
