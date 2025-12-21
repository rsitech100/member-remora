import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { IAPIResponse, ICourse } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await fetchWithAuth<IAPIResponse<ICourse[]>>('/api/courses')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Courses API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses', error: errorMessage },
      { status: 500 }
    )
  }
}
