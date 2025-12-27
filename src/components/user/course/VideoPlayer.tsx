'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { Loading } from '@/components/ui/Loading'
import { IEmbedData } from '@/types/api'

interface VideoPlayerProps {
  videoData: IEmbedData | null
  currentVideoId: string
  previousVideoId?: string | null
  nextVideoId?: string | null
  videoTitle?: string
  videoSubtitle?: string
  videoDescription?: string
  isLoading?: boolean
  hasError?: boolean
  onVideoComplete?: () => void
  onNextVideo?: () => void
  onPreviousVideo?: () => void
}

const VideoPlayerComponent = ({ 
  videoData,
  currentVideoId,
  previousVideoId, 
  nextVideoId, 
  videoTitle,
  videoSubtitle,
  videoDescription,
  isLoading = false,
  hasError = false,
  onVideoComplete,
  onNextVideo,
  onPreviousVideo
}: VideoPlayerProps) => {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const hasCompletedRef = useRef(false)
  const watchedDurationRef = useRef(0)
  const totalDurationRef = useRef(0)

  const embedUrl = videoData?.embed_url || ''
  const displayTitle = videoData?.video_title || videoTitle || 'Video'

  const markVideoComplete = useCallback(async () => {
    if (hasCompletedRef.current || !currentVideoId) return
    
    hasCompletedRef.current = true
    
    try {
      const response = await fetch(`/api/videos/${currentVideoId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        await fetch('/api/logout', { method: 'POST' }).catch(() => {})
        window.location.href = '/login'
        return
      }
      
      if (onVideoComplete) {
        onVideoComplete()
      }
    } catch (error) {
      console.error('Error marking video complete:', error)
      hasCompletedRef.current = false
    }
  }, [currentVideoId, onVideoComplete])

  const handleMessage = useCallback((event: MessageEvent) => {
    if (!event.origin.includes('remoratrader.id')) return
    
    switch (event.data.type) {
      case 'video-buffering':
        setIsBuffering(true)
        break
      case 'video-playing':
      case 'video-canplay':
        setIsBuffering(false)
        break
      case 'video-timeupdate':
        if (event.data.currentTime) {
          watchedDurationRef.current = event.data.currentTime
        }
        if (event.data.duration) {
          totalDurationRef.current = event.data.duration
        }
        
        if (totalDurationRef.current > 0) {
          const progress = watchedDurationRef.current / totalDurationRef.current
          if (progress >= 0.9) {
            markVideoComplete()
          }
        }
        break
      case 'video-ended':
        markVideoComplete()
        break
    }
  }, [markVideoComplete])

  useEffect(() => {
    hasCompletedRef.current = false
    watchedDurationRef.current = 0
    totalDurationRef.current = 0
  }, [currentVideoId])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  const handleLoad = useCallback(() => setIframeLoaded(true), [])
  const handleError = useCallback(() => setIframeLoaded(true), [])

  // Enhanced embed URL
  const videoUrl = embedUrl ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&muted=0&controls=1` : ''

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {(isLoading || !iframeLoaded || isBuffering) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/75 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loading />
              {isBuffering && <span className="text-white text-sm">Loading video...</span>}
            </div>
          </div>
        )}
        
        {!isLoading && (hasError || !embedUrl) ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <p className="text-lg mb-2">⚠️ Error loading video</p>
              <p className="text-sm text-gray-400">
                {!embedUrl ? 'No video available' : 'Failed to load video player'}
              </p>
            </div>
          </div>
        ) : !isLoading && embedUrl ? (
          <iframe
            src={videoUrl}
            title={displayTitle}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen"
            onLoad={handleLoad}
            onError={handleError}
          />
        ) : null}
      </div>

      {/* Video Info */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-gray-700/50 rounded animate-pulse" />
          </div>
          
          <hr className="border-gray-700"/>
          
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700/50 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-700/50 rounded animate-pulse" />
          </div>
          
          <div className="flex gap-3 pt-6">
            <div className="flex-1 h-12 bg-gray-800 rounded-lg animate-pulse" />
            <div className="flex-1 h-12 bg-gray-800 rounded-lg animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm">{videoSubtitle || videoTitle || 'Course'}</p>
            <h1 className="text-white text-2xl font-bold mt-1">{videoTitle || 'Untitled Video'}</h1>
          </div>
          
          <hr className="border-gray-700"/>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {videoDescription || 'No description available.'}
          </p>
          
          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              onClick={onPreviousVideo}
              disabled={!previousVideoId}
              className={`flex-1 px-6 py-3 rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 ${
                previousVideoId 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white hover:scale-105' 
                  : 'bg-gray-900 text-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Video Sebelumnya
            </button>
            
            <button
              onClick={onNextVideo}
              disabled={!nextVideoId}
              className={`flex-1 px-6 py-3 rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 ${
                nextVideoId 
                  ? 'bg-[#2A9E8B] hover:bg-[#238174] text-white hover:scale-105 hover:shadow-lg' 
                  : 'bg-gray-900 text-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              Video Selanjutnya
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const VideoPlayer = memo(VideoPlayerComponent)
