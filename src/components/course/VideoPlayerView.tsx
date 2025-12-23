'use client'

import { EmbedVideoPlayer } from './EmbedVideoPlayer'
import { VideoDescription } from './VideoDescription'
import { IEmbedData } from '@/types/api'

interface VideoPlayerViewProps {
  videoData: IEmbedData | null
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
  onNextVideo?: () => void
  onPreviousVideo?: () => void
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
  onVideoComplete,
  onNextVideo,
  onPreviousVideo
}: VideoPlayerViewProps) {
  return (
    <div className="space-y-6">
      <EmbedVideoPlayer
        embedUrl={videoData?.embed_url || ''}
        videoTitle={videoData?.video_title || videoTitle || 'Video'}
        isLoading={isLoading}
        hasError={hasError}
      />
      
      <VideoDescription
        title={videoSubtitle || videoTitle || 'Untitled Video'}
        subtitle={videoTitle || 'Untitled Video'}
        description={videoDescription || ''}
        previousVideoId={previousVideoId}
        nextVideoId={nextVideoId}
        onNextVideo={onNextVideo}
        onPreviousVideo={onPreviousVideo}
      />
    </div>
  )
}
