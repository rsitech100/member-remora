'use client'

import { useState, useEffect } from 'react'
import { Loading } from '@/components/ui/Loading'

interface EmbedVideoPlayerProps {
  embedUrl: string
  videoTitle: string
  isLoading?: boolean
  hasError?: boolean
}

export function EmbedVideoPlayer({ 
  embedUrl,
  videoTitle,
  isLoading = false,
  hasError = false
}: EmbedVideoPlayerProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('remora')) return
      
      if (event.data.type === 'video-buffering') {
        setIsBuffering(true)
      } else if (event.data.type === 'video-playing') {
        setIsBuffering(false)
      } else if (event.data.type === 'video-canplay') {
        setIsBuffering(false)
      }
      
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleIframeLoad = () => {
    setIframeLoaded(true)
  }

  const handleIframeError = () => {
    setIframeLoaded(true)
  }

  if (isLoading) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <Loading />
        </div>
      </div>
    )
  }

  if (hasError || !embedUrl || embedUrl.trim() === '') {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white p-4">
          <p className="text-lg mb-2">⚠️ Error loading video</p>
          <p className="text-sm text-gray-400">
            {!embedUrl ? 'No embed URL available' : 'Failed to load video player'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {(!iframeLoaded || isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <div className="flex flex-col items-center gap-2">
            <Loading />
            {isBuffering && <span className="text-white text-sm">Loading video...</span>}
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={videoTitle}
        className="w-full h-full"
        frameBorder="0"
        style={{ border: 'none', pointerEvents: 'auto' }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  )
}