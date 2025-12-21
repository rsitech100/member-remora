'use client'

import { VideoPlayer } from './VideoPlayer'
import { VideoDescription } from './VideoDescription'
import { IWatchVideoData } from '@/types/api'

interface VideoPlayerViewProps {
  videoData: IWatchVideoData | null
  currentVideoId: string
  previousVideoId?: string | null
  nextVideoId?: string | null
  thumbnail?: string
  courseTitle?: string
  videoTitle?: string
  videoSubtitle?: string
  videoDescription?: string
  isLoading?: boolean
  hasError?: boolean
  onVideoComplete?: () => void
}

export function VideoPlayerView({ 
  videoData, 
  currentVideoId, 
  previousVideoId, 
  nextVideoId, 
  thumbnail,
  courseTitle,
  videoTitle,
  videoSubtitle,
  videoDescription,
  isLoading = false,
  hasError = false,
  onVideoComplete
}: VideoPlayerViewProps) {
  return (
    <div className="space-y-6">
      <VideoPlayer
        videoId={currentVideoId}
        videoUrl={videoData?.video_url || ''}
        thumbnail={thumbnail || ''}
        title={videoData?.title || videoTitle || 'Video'}
        isLoading={isLoading}
        hasError={hasError && !isLoading}
        onVideoComplete={onVideoComplete}
      />
      
      <VideoDescription
        title={videoSubtitle || videoTitle || 'Untitled Video'}
        subtitle={videoTitle || 'Untitled Video'}
        description={videoDescription || ''}
        previousVideoId={previousVideoId}
        nextVideoId={nextVideoId}
      />
    </div>
  )
}
