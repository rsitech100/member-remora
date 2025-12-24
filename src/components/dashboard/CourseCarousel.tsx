import { CourseCardSmall } from '../cards/CourseCardSmall'
import { CarouselWrapper } from './CarouselWrapper'
import { ICourse } from '@/types/api'

interface CourseCarouselProps {
  course: ICourse[]
}

export function CourseCarousel({ course }: CourseCarouselProps) {
  const coursesToDisplay = course.map((item, index) => ({
    id: item.id.toString(),
    title: item.title,
    description: item.description,
    thumbnail: item.image || '/images/dummy-image.png',
    duration: `${item.videos.length} Videos`,
    instructor: item.subtitle,
    completed: index === 0,
    status: index === 0 ? 'completed' as const : index === 1 ? 'now_watching' as const : undefined,
  }))

  return (
    <CarouselWrapper title="All Course">
      {coursesToDisplay.map((course) => (
        <CourseCardSmall key={course.id} {...course} />
      ))}
    </CarouselWrapper>
  )
}
