'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VideoPlayerView } from '@/components/course/VideoPlayerView'
import { ProgressListView } from '@/components/course/ProgressListView'
import { ICourseDetailData, IWatchHLSData, IAPIResponse } from '@/types/api'

interface CourseContentProps {
  initialVideoId: string
  courseData: ICourseDetailData
}

export function CourseContent({ initialVideoId, courseData }: CourseContentProps) {
  const [currentVideoId, setCurrentVideoId] = useState(initialVideoId)
  const [videoData, setVideoData] = useState<IWatchHLSData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const router = useRouter()

  const currentIndex = courseData.videos.findIndex(v => v.id.toString() === currentVideoId)
  const currentVideo = courseData.videos[currentIndex]
  
  const previousVideoId = currentIndex > 0 
    ? courseData.videos[currentIndex - 1].id.toString() 
    : null
    
  const nextVideoId = currentIndex >= 0 && 
    currentIndex < courseData.videos.length - 1 && 
    currentVideo?.is_completed
    ? courseData.videos[currentIndex + 1].id.toString()
    : null

  useEffect(() => {
    async function fetchVideo() {
      if (isFetching) return
      
      setIsFetching(true)
      setIsLoading(true)
      setError(false)
      
      try {
        const response = await fetch(`/api/watch-hls/${currentVideoId}`)
        const result: IAPIResponse<IWatchHLSData> = await response.json()
        
        if (result.success && result.data) {
          setVideoData(result.data)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching video:', err)
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
  
  const handleVideoComplete = () => {
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
        <VideoPlayerView
          key={currentVideoId}
          videoData={videoData}
          currentVideoId={currentVideoId}
          previousVideoId={previousVideoId}
          nextVideoId={nextVideoId}
          thumbnail={courseData.course.image}
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
          <ProgressListView 
            courseVideos={courseData.videos}
            currentVideoId={currentVideoId}
            courseTitle={courseData.course.title}
            onVideoClick={handleVideoChange}
          />
        </div>
      </div>
    </div>
  )
}
