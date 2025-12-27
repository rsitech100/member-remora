'use client'

import { useState, useEffect, useCallback, memo, useMemo } from 'react'
import { Loading } from '@/components/ui/Loading'

interface EmbedVideoPlayerProps {
  embedUrl: string
  videoTitle: string
  isLoading?: boolean
  hasError?: boolean
}

const EmbedVideoPlayerComponent = ({ 
  embedUrl,
  videoTitle,
  isLoading = false,
  hasError = false
}: EmbedVideoPlayerProps) => {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)

  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true)
  }, [])

  const handleIframeError = useCallback(() => {
    setIframeLoaded(true)
  }, [])

  const handleMessage = useCallback((event: MessageEvent) => {
    if (!event.origin.includes('remoratrader.id')) return
    
    if (event.data.type === 'video-buffering') {
      setIsBuffering(true)
    } else if (event.data.type === 'video-playing' || event.data.type === 'video-canplay') {
      setIsBuffering(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  const enhancedUrl = useMemo(() => {
    if (!embedUrl || embedUrl.trim() === '') return ''
    return `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&muted=0&controls=1`
  }, [embedUrl])

  if (isLoading || hasError || !enhancedUrl) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <Loading />
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
        src={enhancedUrl}
        title={videoTitle}
        className="w-full h-full"
        allowFullScreen
        allow="autoplay *; encrypted-media *; fullscreen *"
        style={{ border: 'none', pointerEvents: 'auto' }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  )
}

export const EmbedVideoPlayer = memo(EmbedVideoPlayerComponent)