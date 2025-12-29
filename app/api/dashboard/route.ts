import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth, APIError } from '@/lib/api'
import { getAuthToken, removeAuthToken } from '@/lib/auth'
import { IAPIResponse, IDashboardData } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken()
    console.log('[Dashboard API] Token exists:', !!token)
    
    if (!token) {
      console.log('[Dashboard API] No token found')
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token found' },
        { status: 401 }
      )
    }

    const data = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
    console.log('[Dashboard API] Success, user:', data.data?.user?.name || 'Unknown')
    return NextResponse.json(data)
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).includes('NEXT_REDIRECT')) {
      throw error
    }
    
    if (error instanceof APIError) {
      console.log('[Dashboard API] APIError:', {
        status: error.status,
        statusText: error.statusText,
        endpoint: error.endpoint,
        responseBody: error.responseBody,
        isAuthError: error.isAuthError()
      })
      
      if (error.isAuthError()) {
        await removeAuthToken().catch(() => {})
        
        const response = NextResponse.json(
          { success: false, message: 'Session expired - Please login again', error: error.message },
          { status: 401 }
        )
        
        response.cookies.delete('auth_token')
        return response
      }
      
      return NextResponse.json(
        { success: false, message: 'API request failed', error: error.message },
        { status: error.status }
      )
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.log('[Dashboard API] Unexpected error:', errorMessage)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data', error: errorMessage },
      { status: 500 }
    )
  }
}
