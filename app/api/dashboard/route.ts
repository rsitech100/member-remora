import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/api'
import { getAuthToken, removeAuthToken } from '@/lib/auth'
import { IAPIResponse, IDashboardData } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token found' },
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
    
    const isAuthError = errorMessage.includes('401') || 
                       errorMessage.includes('403') ||
                       errorMessage.toLowerCase().includes('unauthorized') ||
                       errorMessage.toLowerCase().includes('invalid token') ||
                       errorMessage.toLowerCase().includes('session expired') ||
                       errorMessage.toLowerCase().includes('token')
    
    if (isAuthError) {
      await removeAuthToken()
      
      const response = NextResponse.json(
        { success: false, message: 'Session expired - Please login again', error: errorMessage },
        { status: 401 }
      )
      
      response.cookies.delete('auth_token')
      
      return response
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data', error: errorMessage },
      { status: 500 }
    )
  }
}
