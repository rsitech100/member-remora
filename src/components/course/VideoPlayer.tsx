'use client'

import { useState, useRef } from 'react'
import { Loading } from '../ui/Loading'

interface VideoPlayerProps {
  videoId: string
  videoUrl: string
  thumbnail: string
  title: string
  isLoading?: boolean
  hasError?: boolean
  onVideoComplete?: () => void
}

export function VideoPlayer({ 
  videoId, 
  videoUrl, 
  thumbnail, 
  title,
  isLoading: externalLoading = false,
  hasError = false,
  onVideoComplete
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasWatched, setHasWatched] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoEnd = async () => {
    if (hasWatched || hasError) return
    
    const video = videoRef.current
    if (!video || video.error || video.currentTime < video.duration - 1) {
      return
    }
    
    try {
      setHasWatched(true)
      const response = await fetch(`/api/videos/${videoId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        if (onVideoComplete) {
          onVideoComplete()
        }
      } else {
        setHasWatched(false)
      }
    } catch (error) {
      console.error('Error marking video as complete:', error)
      setHasWatched(false)
    }
  }

  const handlePlayClick = () => {
    if (!videoLoaded) {
      setVideoLoaded(true)
      setIsLoading(true)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load()
          videoRef.current.play()
        }
      }, 100)
    } else if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const proxiedVideoUrl = videoUrl ? `/api/files/${encodeURIComponent(videoUrl.split('/').pop() || '')}` : ''
  
  const posterImage = thumbnail || undefined

  return (
    <div className="space-y-6">
      <h2 className="text-[#2A9E8B] text-xl font-semibold animate-in fade-in slide-in-from-left-4 duration-500">You're Watching</h2>
      
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-700 delay-150 shadow-2xl hover:shadow-[#2A9E8B]/20 transition-shadow">
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-4 animate-in zoom-in-50 duration-500 delay-150">
                <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm mb-2 animate-in fade-in duration-500 delay-300">Video currently unavailable</p>
              <p className="text-gray-500 text-xs animate-in fade-in duration-500 delay-500">The video is being processed or temporarily unavailable</p>
            </div>
          </div>
        ) : (
          <>
            {(isLoading || externalLoading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <Loading />
              </div>
            )}
            
            {!videoLoaded && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer z-20 group animate-in fade-in duration-500"
                onClick={handlePlayClick}
              >
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-all group-hover:scale-110 animate-pulse">
                  <svg 
                    className="w-10 h-10 text-[#1A5850] ml-1" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={posterImage}
              controls
              onPlay={() => {
                setIsPlaying(true)
                setIsLoading(true)
              }}
              onPause={() => setIsPlaying(false)}
              onLoadedData={() => setIsLoading(false)}
              onEnded={handleVideoEnd}
            >
              {videoLoaded && proxiedVideoUrl && <source src={proxiedVideoUrl} type="video/mp4" />}
            </video>
            
            {!isPlaying && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 animate-in fade-in duration-300">
                <button 
                  onClick={() => videoRef.current?.play()}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 flex items-center justify-center group hover:scale-110 animate-in zoom-in-50 duration-500"
                >
                  <svg className="w-10 h-10 text-white ml-1 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
