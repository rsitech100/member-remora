import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { IAPIResponse, ICourseDetailData, IVideo } from '@/types/api'

export const dynamic = 'force-dynamic'

interface V2Video {
  id: number
  course_id: number
  title: string
  subtitle?: string
  description?: string
  playback_url?: string
  status?: string
  order?: number
  is_published?: boolean
}

interface V2CourseDetail {
  id: number
  title: string
  subtitle: string
  description: string
  image?: string
  thumbnail_url?: string
  videos?: V2Video[]
}

function mapVideo(video: V2Video): IVideo {
  const mappedStatus: IVideo['status'] = video.is_published ? 'active' : 'inactive'
  const mappedHlsStatus: IVideo['hls_status'] =
    video.status === 'ready'
      ? 'ready'
      : video.status === 'processing'
      ? 'processing'
      : video.status === 'failed'
      ? 'failed'
      : 'pending'

  return {
    id: video.id,
    course_id: video.course_id,
    title: video.title,
    subtitle: video.subtitle || '',
    description: video.description || '',
    original_video: video.playback_url || '',
    status: mappedStatus,
    order: video.order ?? 0,
    hls_status: mappedHlsStatus,
  }
}

function isNormalizedDetail(value: unknown): value is ICourseDetailData {
  return !!value && typeof value === 'object' && 'course' in value && 'videos' in value
}

function normalizeCourseDetail(value: unknown): ICourseDetailData {
  if (isNormalizedDetail(value)) {
    return {
      ...value,
      videos: (value.videos || []).map((video) => ({
        ...video,
        status: video.status || 'inactive',
        order: video.order ?? 0,
      })),
    }
  }

  const raw = value as V2CourseDetail
  return {
    course: {
      id: raw.id,
      title: raw.title,
      subtitle: raw.subtitle,
      description: raw.description,
      image: raw.image || raw.thumbnail_url || '',
    },
    videos: (raw.videos || []).map(mapVideo),
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
    const data = await fetchWithAuth<IAPIResponse<unknown>>(`/api/v2/user/course/${id}`)
    const normalizedData: IAPIResponse<ICourseDetailData> = {
      ...data,
      data: normalizeCourseDetail(data.data),
    }

    return NextResponse.json(normalizedData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).includes('NEXT_REDIRECT')) {
      throw error
    }
    return NextResponse.json(
      { success: false, message: 'Failed to fetch course details' },
      { status: 500 }
    )
  }
}
