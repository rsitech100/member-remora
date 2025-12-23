'use client'

import { HLSVideoPlayer } from './HLSVideoPlayer'
import { VideoDescription } from './VideoDescription'
import { IWatchHLSData } from '@/types/api'

interface VideoPlayerViewProps {
  videoData: IWatchHLSData | null
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
      {isLoading ? (
        <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <p className="text-white">Loading video...</p>
        </div>
      ) : hasError ? (
        <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <p className="text-white">Error loading video</p>
        </div>
      ) : videoData?.playlist_url ? (
        <HLSVideoPlayer
          videoId={currentVideoId}
          playlistUrl={videoData.playlist_url}
          title={videoData?.title || videoTitle || 'Video'}
          description={videoData?.description}
          onVideoComplete={onVideoComplete}
        />
      ) : null}
      
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
