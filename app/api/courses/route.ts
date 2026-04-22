import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { IAPIResponse, ICourse, IVideo } from '@/types/api'

export const dynamic = 'force-dynamic'

interface V2Video {
  id: number
  course_id: number
  title: string
  subtitle?: string
  description?: string
  playback_url?: string
  status?: string
  upload_status?: string
  order?: number
  is_published?: boolean
}

interface V2Course {
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

function mapCourse(course: V2Course): ICourse {
  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    image: course.image || course.thumbnail_url || '',
    videos: (course.videos || []).map(mapVideo),
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await fetchWithAuth<IAPIResponse<V2Course[]>>('/api/v2/user/course')
    const normalizedData: IAPIResponse<ICourse[]> = {
      ...data,
      data: Array.isArray(data.data) ? data.data.map(mapCourse) : [],
    }

    return NextResponse.json(normalizedData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses', error: errorMessage },
      { status: 500 }
    )
  }
}
