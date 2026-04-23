'use server'

import { fetchWithAuth } from '@/lib/api'
import type { IAPIResponse, ICourseDetailData, IEmbedData, IVideo } from '@/types/api'
import type { ActionResult } from '@/actions/shared'
import { toActionError } from '@/actions/shared'

interface V2UserVideoData {
  video_id?: number
  title?: string
  description?: string
  playback_url?: string
  original_url?: string
  thumbnail_url?: string
  duration?: number
  expires_in?: number
  video_token?: string
  embed_url?: string
  video_title?: string
}

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

function normalizeEmbedData(videoId: string, payload: IAPIResponse<V2UserVideoData>): IEmbedData {
  const source = payload?.data || {}
  const apiBaseUrl = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '')
  const playPath = `/api/v2/user/video/${videoId}/play`

  const playbackUrl = source.playback_url
    ? source.playback_url.startsWith('http')
      ? source.playback_url
      : `${apiBaseUrl}${source.playback_url}`
    : ''

  const embedUrl =
    source.embed_url ||
    playbackUrl ||
    source.original_url ||
    (source.video_token ? `${apiBaseUrl}${playPath}?video_token=${encodeURIComponent(source.video_token)}` : `${apiBaseUrl}${playPath}`)

  return {
    embed_url: embedUrl,
    user_name: '',
    user_phone: '',
    video_title: source.video_title || source.title || `Video ${videoId}`,
  }
}

export async function fetchUserVideoEmbed(videoId: string): Promise<ActionResult<IEmbedData>> {
  try {
    const response = await fetchWithAuth<IAPIResponse<V2UserVideoData>>(`/api/v2/user/video/${videoId}`)
    return { ok: true, data: normalizeEmbedData(videoId, response) }
  } catch (error) {
    return toActionError(error, 'Failed to fetch video embed')
  }
}

export async function fetchUserCourseDetail(courseId: string | number): Promise<ActionResult<ICourseDetailData>> {
  try {
    const response = await fetchWithAuth<IAPIResponse<unknown>>(`/api/v2/user/course/${courseId}`)
    return { ok: true, data: normalizeCourseDetail(response.data) }
  } catch (error) {
    return toActionError(error, 'Failed to fetch course')
  }
}

export async function completeUserVideo(videoId: string | number): Promise<ActionResult<null>> {
  try {
    await fetchWithAuth(`/api/videos/${videoId}/complete`, { method: 'POST' })
    return { ok: true, data: null }
  } catch (error) {
    return toActionError(error, 'Failed to mark video complete')
  }
}

