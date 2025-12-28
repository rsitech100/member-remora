import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, ICourseDetailData } from '@/types/api'
import { Container } from '@/components/layout/Container'
import { CourseContentWrapper } from './CourseContentWrapper'
import { VideoPlayerSkeleton, CourseProgressSkeleton } from '@/components/ui/Skeleton'

async function getCourseVideos(courseId: string) {
  try {
    const response = await fetchWithAuth<IAPIResponse<ICourseDetailData>>(`/api/courses/${courseId}`)
    return response.data
  } catch (error) {
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

  return (
    <CourseContentWrapper 
      initialVideoId={videoId}
      courseData={courseData}
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
