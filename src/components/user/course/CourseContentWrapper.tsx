'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { VideoPlayer } from './VideoPlayer'
import { VideoProgressList } from './VideoProgressList'
import { ICourseDetailData, IEmbedData, IAPIResponse } from '@/types/api'
import { getVideoNavigation } from './utils'

interface CourseContentWrapperProps {
  initialVideoId: string
  courseData: ICourseDetailData
}

export function CourseContentWrapper({ initialVideoId, courseData }: CourseContentWrapperProps) {
  const [currentVideoId, setCurrentVideoId] = useState(initialVideoId)
  const [videoData, setVideoData] = useState<IEmbedData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const router = useRouter()

  const { currentVideo, previousVideoId, nextVideoId } = useMemo(
    () => getVideoNavigation(courseData.videos, currentVideoId),
    [currentVideoId, courseData.videos]
  )

  useEffect(() => {
    let isCancelled = false

    async function fetchVideo() {
      if (isFetching) return
      
      setIsFetching(true)
      setIsLoading(true)
      setError(false)
      
      try {
        const response = await fetch(`/api/embed/${currentVideoId}`)
        const result: IAPIResponse<IEmbedData> = await response.json()
        
        if (isCancelled) return
        
        if (result.success && result.data) {
          setVideoData(result.data)
        } else {
          setError(true)
        }
      } catch (err) {
        if (!isCancelled) setError(true)
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
          setIsFetching(false)
        }
      }
    }

    fetchVideo()
    return () => { isCancelled = true }
  }, [currentVideoId, isFetching])

  const handleVideoChange = useCallback((videoId: string) => {
    setCurrentVideoId(videoId)
  }, [])
  
  const handleVideoComplete = useCallback(() => {
    router.refresh()
  }, [router])

  const handleNextVideo = useCallback(() => {
    if (nextVideoId) {
      setCurrentVideoId(nextVideoId)
    }
  }, [nextVideoId])

  const handlePreviousVideo = useCallback(() => {
    if (previousVideoId) {
      setCurrentVideoId(previousVideoId)
    }
  }, [previousVideoId])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 animate-in fade-in slide-in-from-left-8 duration-500">
        <VideoPlayer
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
          <VideoProgressList 
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
