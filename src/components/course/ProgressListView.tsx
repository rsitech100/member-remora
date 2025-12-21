'use client'

import { CourseProgressList } from '../lists/CourseProgressList'
import { IVideo } from '@/types/api'

interface ProgressListViewProps {
  courseVideos: IVideo[]
  currentVideoId: string
  courseTitle: string
  onVideoClick?: (videoId: string) => void
}

export function ProgressListView({ 
  courseVideos, 
  currentVideoId, 
  courseTitle,
  onVideoClick 
}: ProgressListViewProps) {
  const firstIncompleteIndex = courseVideos.findIndex(video => !video.is_completed)
  
  const courses = courseVideos.map((video, index) => {
    const status: 'completed' | 'watching' = video.is_completed ? 'completed' : 'watching'
    
    const isAccessible = video.is_completed || 
                        index === firstIncompleteIndex || 
                        index === 0
    
    return {
      id: video.id.toString(),
      title: video.title,
      duration: courseTitle,
      status,
      isAccessible,
    }
  })

  return <CourseProgressList courses={courses} onVideoClick={onVideoClick} />
}
