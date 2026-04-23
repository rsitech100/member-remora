import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'

export async function GET() {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await fetchWithAuth('/api/v2/admin/video')
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch videos'
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}

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
    const courseIdFromQuery = request.nextUrl.searchParams.get('course_id')
    const courseIdFromBody = body?.course_id != null ? String(body.course_id) : null
    const courseId = courseIdFromQuery || courseIdFromBody

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: 'course_id is required' },
        { status: 400 }
      )
    }

    const requestBody = { ...body }
    delete requestBody.course_id

    const data = await fetchWithAuth(`/api/v2/admin/video?course_id=${encodeURIComponent(courseId)}`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
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
