import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { IAPIResponse, IEmbedData } from '@/types/api'

interface V2UserVideoData {
  video_id?: number
  title?: string
  description?: string
  playback_url?: string
  thumbnail_url?: string
  duration?: number
  expires_in?: number
  video_token?: string
  embed_url?: string
  video_title?: string
}

function toEmbedResponse(id: string, payload: IAPIResponse<V2UserVideoData>): IAPIResponse<IEmbedData> {
  const source = payload?.data || {}
  const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || ''
  const playPath = `/api/v2/user/video/${id}/play`

  const embedUrl =
    source.embed_url ||
    source.playback_url ||
    (source.video_token ? `${apiBaseUrl}${playPath}?video_token=${encodeURIComponent(source.video_token)}` : `${apiBaseUrl}${playPath}`)

  return {
    success: payload.success,
    message: payload.message,
    data: {
      embed_url: embedUrl,
      user_name: '',
      user_phone: '',
      video_title: source.video_title || source.title || `Video ${id}`,
    },
  }
}

export async function GET(
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

    const data = await fetchWithAuth<IAPIResponse<V2UserVideoData>>(`/api/v2/user/video/${id}`)
    const normalizedData = toEmbedResponse(id, data)

    return NextResponse.json(normalizedData)
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).includes('NEXT_REDIRECT')) {
      throw error
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, message: 'Failed to fetch embed player', error: errorMessage },
      { status: 200 }
    )
  }
}
