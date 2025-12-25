import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    
    const data = await fetchWithAuth(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })

    return NextResponse.json(data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update course'
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const data = await fetchWithAuth(`/api/courses/${id}`, {
      method: 'DELETE',
    })

    return NextResponse.json(data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete course'
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}
