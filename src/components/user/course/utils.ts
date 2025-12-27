import { IVideo } from '@/types/api'

export function getVideoNavigation(
  videos: IVideo[],
  currentVideoId: string
) {
  const currentIndex = videos.findIndex(v => v.id.toString() === currentVideoId)
  const currentVideo = videos[currentIndex]

  return {
    currentIndex,
    currentVideo,
    previousVideoId: currentIndex > 0 ? videos[currentIndex - 1].id.toString() : null,
    nextVideoId:
      currentIndex >= 0 &&
      currentIndex < videos.length - 1 &&
      currentVideo?.is_completed
        ? videos[currentIndex + 1].id.toString()
        : null,
  }
}

export function transformVideosForProgress(
  videos: IVideo[],
  currentVideoId: string,
  courseTitle: string
) {
  const firstIncompleteIndex = videos.findIndex(video => !video.is_completed)

  return videos.map((video, index) => {
    const isCurrentVideo = video.id.toString() === currentVideoId
    const status: 'completed' | 'now_watching' | 'not_started' =
      isCurrentVideo ? 'now_watching' : video.is_completed ? 'completed' : 'not_started'

    const isAccessible = video.is_completed || index === firstIncompleteIndex || index === 0

    return {
      id: video.id.toString(),
      title: video.title,
      duration: courseTitle,
      status,
      isAccessible,
    }
  })
}
