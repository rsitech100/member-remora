'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VideoPlayer } from './VideoPlayer'
import { VideoProgressList } from './VideoProgressList'
import { ICourseDetailData, IEmbedData, IAPIResponse } from '@/types/api'

interface CourseContentWrapperProps {
  initialVideoId: string
  courseData: ICourseDetailData
}

export function CourseContentWrapper({ initialVideoId, courseData: initialCourseData }: CourseContentWrapperProps) {
  const [currentVideoId, setCurrentVideoId] = useState(initialVideoId)
  const [videoData, setVideoData] = useState<IEmbedData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [courseData, setCourseData] = useState(initialCourseData)
  const router = useRouter()

  const videos = courseData?.videos || []
  const currentIndex = videos.findIndex(v => v.id.toString() === currentVideoId)
  const currentVideo = videos[currentIndex]
  
  const previousVideoId = currentIndex > 0 
    ? videos[currentIndex - 1].id.toString() 
    : null
    
  const nextVideoId = currentIndex >= 0 && 
    currentIndex < videos.length - 1 && 
    currentVideo?.is_completed
    ? videos[currentIndex + 1].id.toString()
    : null

  useEffect(() => {
    async function fetchVideo() {
      if (isFetching) return
      
      setIsFetching(true)
      setIsLoading(true)
      setError(false)
      
      try {
        const response = await fetch(`/api/embed/${currentVideoId}`)
        
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          await fetch('/api/logout', { method: 'POST' }).catch(() => {})
          window.location.href = '/login'
          return
        }
        
        const result: IAPIResponse<IEmbedData> = await response.json()
        
        // Check for auth errors in response body
        if (!result.success && result.message) {
          const msg = result.message.toLowerCase()
          if (msg.includes('unauthorized') || msg.includes('token') || msg.includes('expired')) {
            await fetch('/api/logout', { method: 'POST' }).catch(() => {})
            window.location.href = '/login'
            return
          }
        }
        
        if (result.success && result.data) {
          setVideoData(result.data)
        } else {
          setError(true)
        }
      } catch (err) {
        setError(true)
      } finally {
        setIsLoading(false)
        setIsFetching(false)
      }
    }

    fetchVideo()
  }, [currentVideoId])

  const handleVideoChange = (videoId: string) => {
    setCurrentVideoId(videoId)
  }
  
  const handleVideoComplete = async () => {
    // Update local state to mark current video as completed
    setCourseData(prevData => ({
      ...prevData,
      videos: prevData.videos.map(video => 
        video.id.toString() === currentVideoId 
          ? { ...video, is_completed: true }
          : video
      )
    }))
    
    try {
      const response = await fetch(`/api/courses/${courseData.course.id}`)
      const result: IAPIResponse<ICourseDetailData> = await response.json()
      
      if (result.success && result.data) {
        setCourseData({
          ...result.data,
          videos: result.data.videos || []
        })
      }
    } catch (error) {
    }
    
    router.refresh()
  }

  const handleNextVideo = () => {
    if (nextVideoId) {
      setCurrentVideoId(nextVideoId)
    }
  }

  const handlePreviousVideo = () => {
    if (previousVideoId) {
      setCurrentVideoId(previousVideoId)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 animate-in fade-in slide-in-from-left-8 duration-500">
        <VideoPlayer
          key={currentVideoId}
          videoData={videoData}
          currentVideoId={currentVideoId}
          previousVideoId={previousVideoId}
          nextVideoId={nextVideoId}
          videoTitle={currentVideo?.title || ''}
          videoSubtitle={currentVideo?.subtitle || ''}
          videoDescription={currentVideo?.description || ''}
          isLoading={isLoading}
          hasError={error}
          onVideoComplete={handleVideoComplete}
          onNextVideo={handleNextVideo}
          onPreviousVideo={handlePreviousVideo}
        />
      </div>
      
      <div className="lg:col-span-1 animate-in fade-in slide-in-from-right-8 duration-500 delay-150">
        <div className="sticky top-24">
          <VideoProgressList 
            courseVideos={videos}
            currentVideoId={currentVideoId}
            courseTitle={courseData.course.title}
            onVideoClick={handleVideoChange}
          />
        </div>
      </div>
    </div>
  )
}
