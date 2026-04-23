'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VideoPlayer } from './VideoPlayer'
import { VideoProgressList } from './VideoProgressList'
import { ICourseDetailData, IEmbedData } from '@/types/api'
import { fetchUserCourseDetail, fetchUserVideoEmbed } from '@/actions/user'

interface CourseContentWrapperProps {
  initialVideoId: string
  courseData: ICourseDetailData
  initialVideoData: IEmbedData | null
}

export function CourseContentWrapper({ initialVideoId, courseData: initialCourseData, initialVideoData }: CourseContentWrapperProps) {
  const hasInitialEmbedUrl = !!initialVideoData?.embed_url
  const [currentVideoId, setCurrentVideoId] = useState(initialVideoId)
  const [videoData, setVideoData] = useState<IEmbedData | null>(hasInitialEmbedUrl ? initialVideoData : null)
  const [isLoading, setIsLoading] = useState(!hasInitialEmbedUrl)
  const [error, setError] = useState(false)
  const [courseData, setCourseData] = useState<ICourseDetailData>(initialCourseData)
  const router = useRouter()

  const videos = courseData?.videos || []
  const currentIndex = videos.findIndex(v => v.id.toString() === currentVideoId)
  const currentVideo = videos[currentIndex]
  
  const previousVideoId = currentIndex > 0 
    ? videos[currentIndex - 1].id.toString() 
    : null
    
  const nextVideoId = currentIndex >= 0 && currentIndex < videos.length - 1
    ? videos[currentIndex + 1].id.toString()
    : null

  useEffect(() => {
    async function fetchVideo() {
      if (currentVideoId === initialVideoId && hasInitialEmbedUrl) {
        return
      }

      setIsLoading(true)
      setError(false)
      
      try {
        const result = await fetchUserVideoEmbed(currentVideoId)

        if (!result.ok) {
          if (result.auth) {
            await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            const memberUrl = process.env.NEXT_PUBLIC_MEMBER_APP_URL
            window.location.href = memberUrl ? `${memberUrl}/login` : '/login'
            return
          }

          setError(true)
          return
        }

        setVideoData(result.data)
      } catch {
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideo()
  }, [currentVideoId, hasInitialEmbedUrl, initialVideoId])

  const handleVideoChange = (videoId: string) => {
    if (videoId === currentVideoId) {
      return
    }
    setCurrentVideoId(videoId)
  }
  
  const handleVideoComplete = async () => {
    setCourseData(prevData => ({
      ...prevData,
      videos: prevData.videos.map(video => 
        video.id.toString() === currentVideoId 
          ? { ...video, is_completed: true }
          : video
      )
    }))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const courseId = courseData?.course?.id
      if (!courseId) {
        router.refresh()
        return
      }

      const result = await fetchUserCourseDetail(courseId)
      if (result.ok) {
        setCourseData(result.data)
      }
    } catch {
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
            courseTitle={courseData?.course?.title || ''}
            onVideoClick={handleVideoChange}
          />
        </div>
      </div>
    </div>
  )
}
