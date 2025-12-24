import { CourseCard } from '../cards/CourseCard'
import { ProgressCard } from '../cards/ProgressCard'
import { LastVideoCard } from '../cards/LastVideoCard'
import { CourseCardSmall } from '../cards/CourseCardSmall'
import { PromoCard } from '../cards/PromoCard'
import { Container } from '../layout/Container'
import { CarouselWrapper } from './CarouselWrapper'
import { IUser, IDashboardCourse, ICourse } from '@/types/api'

interface DashboardViewProps {
  user: IUser
  dashboardCourses: (IDashboardCourse & { completed: boolean })[]
  allCourses: ICourse[]
}

export function DashboardView({ user, dashboardCourses, allCourses }: DashboardViewProps) {
  const lastWatchedCourse = dashboardCourses.find(c => c.last_watched_video)
  const lastWatchedVideo = lastWatchedCourse?.last_watched_video

  const totalVideos = dashboardCourses.reduce((sum, course) => sum + course.total_videos, 0)
  const totalCompleted = dashboardCourses.reduce((sum, course) => sum + course.completed_videos, 0)
  const percentage = totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0

  const coursesToDisplay = allCourses.map(course => {
    const dashboardCourse = dashboardCourses.find(dc => dc.course_id === course.id)
    const isCompleted = dashboardCourse?.completed ?? false
    const hasProgress = dashboardCourse && dashboardCourse.completed_videos > 0
    const isNowWatching = hasProgress && !isCompleted
    
    return {
      id: course.id.toString(),
      title: course.title,
      description: course.description,
      thumbnail: '/images/course-1.jpg',
      duration: `${course.videos.length} Videos`,
      instructor: course.subtitle,
      completed: isCompleted,
      status: (isCompleted ? 'completed' : isNowWatching ? 'now_watching' : 'not_started') as 'completed' | 'now_watching' | 'not_started'
    }
  })

  return (
    <>
      {/* Mobile View */}
      <Container className="lg:hidden py-6 space-y-6">
        {lastWatchedVideo && lastWatchedCourse && (
          <LastVideoCard
            title={lastWatchedCourse.title}
            description={lastWatchedCourse.description}
            instructor={user.first_name + ' ' + user.last_name}
            instructorRole="Student"
            thumbnail="/images/last-video.jpg"
            duration={lastWatchedCourse.progress}
            totalVideos={`${lastWatchedCourse.completed_videos}/${lastWatchedCourse.total_videos} Videos`}
            language="Indonesia"
            courseId={lastWatchedCourse.course_id}
          />
        )}

        <CarouselWrapper title="All Course">
          {coursesToDisplay.map((course) => (
            <CourseCardSmall key={course.id} {...course} />
          ))}
        </CarouselWrapper>

        <ProgressCard
          percentage={percentage}
          completed={totalCompleted}
          total={totalVideos}
          isMobile={true}
        />
        
        <PromoCard />
      </Container>

      {/* Desktop View */}
      <Container className="hidden lg:block py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-[#2A9E8B] text-3xl font-semibold mb-4">Semua Modul</h2>
            </div>
            
            <div className="space-y-4">
              {coursesToDisplay.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ProgressCard
                percentage={percentage}
                completed={totalCompleted}
                total={totalVideos}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
