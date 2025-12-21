'use client'

import { VideoPlayer } from './VideoPlayer'
import { IWatchVideoData } from '@/types/api'

interface VideoPlayerViewProps {
  videoData: IWatchVideoData
  currentVideoId: string
  previousVideoId?: string | null
  nextVideoId?: string | null
  thumbnail?: string
}

export function VideoPlayerView({ videoData, currentVideoId, previousVideoId, nextVideoId, thumbnail }: VideoPlayerViewProps) {
  if (!videoData || !videoData.video_url) {
    console.error('Invalid video data:', videoData)
    return (
      <div className="text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Video not available</h2>
        <p>The video data could not be loaded.</p>
      </div>
    )
  }

  return (
    <VideoPlayer
      videoId={currentVideoId}
      videoUrl={videoData.video_url}
      thumbnail={thumbnail || '/images/lesson-video.jpg'}
      title={videoData.title}
      moduleNumber="Module 3"
      description={videoData.description}
      previousVideoId={previousVideoId}
      nextVideoId={nextVideoId}
    />
  )
}
