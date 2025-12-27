import { ICourse } from '@/types/api'

interface CourseWithProgress {
  total_videos?: number
  completed_videos?: number
}

export function calculateTotalProgress(courses: CourseWithProgress[]) {
  const totalVideos = courses.reduce((sum, course) => sum + (course.total_videos || 0), 0)
  const totalCompleted = courses.reduce((sum, course) => sum + (course.completed_videos || 0), 0)
  const percentage = totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0

  return {
    percentage,
    completed: totalCompleted,
    total: totalVideos,
  }
}

export function transformCoursesForCarousel(courses: ICourse[]) {
  return courses.map((item, index) => ({
    id: item.id.toString(),
    title: item.title,
    description: item.description,
    thumbnail: item.image || '/images/dummy-image.png',
    duration: `${item.videos?.length || 0} Videos`,
    instructor: item.subtitle,
    completed: index === 0,
    status: index === 0 ? ('completed' as const) : index === 1 ? ('now_watching' as const) : undefined,
  }))
}
