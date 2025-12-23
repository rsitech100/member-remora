'use client'

import { useEffect, useRef, useState } from 'react'
import { Loading } from '../ui/Loading'

interface HLSVideoPlayerProps {
  videoId: string
  playlistUrl: string
  title: string
  description?: string
  onVideoComplete?: () => void
}

export function HLSVideoPlayer({ 
  videoId, 
  playlistUrl, 
  title,
  description,
  onVideoComplete
}: HLSVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasWatched, setHasWatched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<any>(null)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    const loadHls = async () => {
      if (!videoRef.current || !playlistUrl || isLoadingRef.current) return

      isLoadingRef.current = true

      try {
        const HlsModule = await import('hls.js')
        const Hls = HlsModule.default

        if (Hls.isSupported()) {
          const hls = new Hls({
            debug: false,
            enableWorker: true,
            xhrSetup: (xhr: XMLHttpRequest, url: string) => {
            }
          })

          let fullPlaylistUrl = playlistUrl
          if (playlistUrl.startsWith('/')) {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.API_BASE_URL
            fullPlaylistUrl = `${baseUrl}${playlistUrl}`
          }

          const urlWithId = fullPlaylistUrl.includes('?') 
            ? `${fullPlaylistUrl}&id=${videoId}` 
            : `${fullPlaylistUrl}?id=${videoId}`

          hlsRef.current = hls
          hls.loadSource(urlWithId)
          hls.attachMedia(videoRef.current)

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false)
            isLoadingRef.current = false
          })

          hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad()
                  break
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError()
                  break
                default:
                  setError('Fatal error - cannot play video')
                  setIsLoading(false)
                  isLoadingRef.current = false
                  hls.destroy()
                  break
              }
            }
          })
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = playlistUrl
          setIsLoading(false)
          isLoadingRef.current = false
        } else {
          setError('HLS is not supported in this browser')
          setIsLoading(false)
          isLoadingRef.current = false
        }
      } catch (err) {
        setError('Failed to load video player')
        setIsLoading(false)
        isLoadingRef.current = false
      }
    }

    loadHls()

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
      isLoadingRef.current = false
    }
  }, [playlistUrl, videoId])

  const handleVideoEnd = async () => {
    if (hasWatched) return
    
    const video = videoRef.current
    if (!video || video.error) {
      return
    }
    
    const isAtEnd = video.duration - video.currentTime <= 2
    if (!isAtEnd) {
      return
    }
    
    if (video.currentTime < video.duration * 0.9) {
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
      
      if (response.ok && onVideoComplete) {
        onVideoComplete()
      }
    } catch (error) {
    }
  }

  const handleWaiting = () => {
    setIsLoading(true)
  }

  const handleCanPlay = () => {
    setIsLoading(false)
  }

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white p-4">
          <p className="text-lg mb-2">⚠️ Error loading video</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
            <Loading />
          </div>
        )}
        
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
          onEnded={handleVideoEnd}
          onWaiting={handleWaiting}
          onCanPlay={handleCanPlay}
        >
          <track kind="captions" />
        </video>
      </div>

      {description && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-gray-700 text-sm">{description}</p>
        </div>
      )}
    </div>
  )
}
