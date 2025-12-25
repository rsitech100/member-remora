'use client'

import { IVideo } from '@/types/api'
import { Icon } from '@/components/ui/Icon'
import VideoCard from './VideoCard'

interface VideoListProps {
  videos: IVideo[]
  courseId: number
  onRefresh: () => void
}

export default function VideoList({ videos, courseId, onRefresh }: VideoListProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-gray-800">
        <Icon name="video" className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <div className="text-gray-400 text-lg">No videos yet</div>
        <div className="text-gray-500 text-sm mt-2">Add your first video to this course</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          index={index}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  )
}
