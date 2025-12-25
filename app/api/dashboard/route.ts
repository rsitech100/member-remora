import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/api'
import { getAuthToken, removeAuthToken } from '@/lib/auth'
import { IAPIResponse, IDashboardData } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
    return NextResponse.json(data)
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).includes('NEXT_REDIRECT')) {
      throw error
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      await removeAuthToken()
      return NextResponse.json(
        { success: false, message: 'Invalid token', error: errorMessage },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data', error: errorMessage },
      { status: 500 }
    )
  }
}
