import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, ICourseDetailData, IEmbedData } from '@/types/api'
import { Container } from '@/components/layout/Container'
import { CourseContentWrapper } from './CourseContentWrapper'
import { VideoPlayerSkeleton, CourseProgressSkeleton } from '@/components/ui/Skeleton'

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

type UserCourseApiData =
  | ICourseDetailData
  | {
      id: number
      title: string
      subtitle?: string
      description?: string
      image?: string
      thumbnail_url?: string
      videos?: ICourseDetailData['videos']
    }

function isNestedCourseData(data: UserCourseApiData): data is ICourseDetailData {
  return typeof data === 'object' && data !== null && 'course' in data
}

function normalizeCourseData(data: UserCourseApiData): ICourseDetailData {
  if (isNestedCourseData(data)) {
    return {
      ...data,
      videos: data.videos || [],
    }
  }

  return {
    course: {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle || '',
      description: data.description || '',
      image: data.image || data.thumbnail_url || '',
    },
    videos: data.videos || [],
  }
}

function normalizeEmbedData(videoId: string, payload: IAPIResponse<V2UserVideoData>): IEmbedData {
  const source = payload?.data || {}
  const apiBaseUrl = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '')
  const playPath = `/api/v2/user/video/${videoId}/play`

  const playbackUrl = source.playback_url
    ? source.playback_url.startsWith('http')
      ? source.playback_url
      : `${apiBaseUrl}${source.playback_url}`
    : ''

  const embedUrl =
    source.original_url ||
    source.embed_url ||
    playbackUrl ||
    (source.video_token ? `${apiBaseUrl}${playPath}?video_token=${encodeURIComponent(source.video_token)}` : `${apiBaseUrl}${playPath}`)

  return {
    embed_url: embedUrl,
    user_name: '',
    user_phone: '',
    video_title: source.video_title || source.title || `Video ${videoId}`,
  }
}

async function getCourseVideos(courseId: string) {
  try {
    const response = await fetchWithAuth<IAPIResponse<UserCourseApiData>>(`/api/v2/user/course/${courseId}`)
    return normalizeCourseData(response.data)
  } catch {
    redirect('/login')
  }
}

async function getVideoEmbed(videoId: string) {
  try {
    const response = await fetchWithAuth<IAPIResponse<V2UserVideoData>>(`/api/v2/user/video/${videoId}`)
    return normalizeEmbedData(videoId, response)
  } catch {
    return null
  }
}

interface CourseProps {
  id: string
}

function CoursePageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2">
        <VideoPlayerSkeleton />
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <CourseProgressSkeleton />
        </div>
      </div>
    </div>
  )
}

async function CourseContent({ id }: { id: string }) {
  let courseData = await getCourseVideos(id)
  let courseId = id
  let videoId = id
  
  if (courseData?.videos && courseData.videos.length > 0) {
    const matchingVideo = courseData.videos.find(v => v.id.toString() === id)
    
    if (matchingVideo) {
      courseId = matchingVideo.course_id.toString()
      videoId = id
      if (courseId !== id) {
        courseData = await getCourseVideos(courseId)
      }
    } else {
      videoId = courseData.videos[0].id.toString()
    }
  }

  if (!courseData) {
    redirect('/dashboard')
  }

  const initialVideoData = await getVideoEmbed(videoId)

  return (
    <CourseContentWrapper 
      initialVideoId={videoId}
      courseData={courseData}
      initialVideoData={initialVideoData}
    />
  )
}

export async function CoursePage({ id }: CourseProps) {
  return (
    <Container className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Suspense fallback={<CoursePageSkeleton />}>
        <CourseContent id={id} />
      </Suspense>
    </Container>
  )
}
