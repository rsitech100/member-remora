import { redirect } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { IAPIResponse, ICourseDetailData } from '@/types/api'
import { Container } from '@/components/layout/Container'
import { CourseContent } from '@/components/course/CourseContent'

async function getCourseVideos(courseId: string) {
  try {
    const token = await getAuthToken()
    if (!token) return null
    
    const response = await fetchWithAuth<IAPIResponse<ICourseDetailData>>(`/api/courses/${courseId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching course videos:', error)
    return null
  }
}

interface CoursePageViewProps {
  id: string
}

export async function CoursePageView({ id }: CoursePageViewProps) {
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
    <Container className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CourseContent 
        initialVideoId={videoId}
        courseData={courseData}
      />
    </Container>
  )
}
