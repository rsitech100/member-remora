'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Loading } from '../ui/Loading'

interface VideoPlayerProps {
  videoId: string
  videoUrl: string
  thumbnail: string
  title: string
  moduleNumber: string
  description?: string
  previousVideoId?: string | null
  nextVideoId?: string | null
}

export function VideoPlayer({ 
  videoId, 
  videoUrl, 
  thumbnail, 
  title, 
  moduleNumber, 
  description,
  previousVideoId,
  nextVideoId 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasWatched, setHasWatched] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  const handleVideoEnd = async () => {
    if (hasWatched) return 
    
    try {
      setHasWatched(true)
      await fetch(`/api/videos/${videoId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Error marking video as complete:', error)
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
  
  const videoFilename = videoUrl.split('/').pop()?.replace('.mp4', '') || 'default'
  const posterImage = thumbnail || `/images/${videoFilename}.jpg`

  return (
    <div className="space-y-6">
      <h2 className="text-[#2A9E8B] text-xl font-semibold">You're Watching</h2>
      
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <Loading />
          </div>
        )}
        
        {!videoLoaded && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer z-20 group"
            onClick={handlePlayClick}
          >
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-all">
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button 
              onClick={() => videoRef.current?.play()}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center group"
            >
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">{moduleNumber}</p>
          <h1 className="text-white text-2xl font-bold mt-1">{title}</h1>
        </div>
        
        <hr className="border-gray-700 border-1 my-4 w-full"/>
        
        <p className="text-gray-300 text-sm leading-relaxed">
          {description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam'}
        </p>
        
        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-6">
          {previousVideoId ? (
            <button
              onClick={() => router.push(`/course/${previousVideoId}`)}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Video Sebelumnya
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-6 py-3 bg-gray-900 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2 opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Video Sebelumnya
            </button>
          )}
          
          {nextVideoId ? (
            <button
              onClick={() => router.push(`/course/${nextVideoId}`)}
              className="flex-1 px-6 py-3 bg-[#2A9E8B] hover:bg-[#238174] text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              Video Selanjutnya
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-6 py-3 bg-gray-900 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2 opacity-50"
            >
              Video Selanjutnya
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
