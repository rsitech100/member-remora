import { memo, useMemo } from 'react'
import { CourseCardSmall } from '@/components/user/cards/CourseCardSmall'
import { CarouselWrapper } from './CarouselWrapper'
import { ICourse } from '@/types/api'
import { transformCoursesForCarousel } from './utils'

interface CourseCarouselProps {
  course: ICourse[]
}

const CourseCarouselComponent = ({ course }: CourseCarouselProps) => {
  const coursesToDisplay = useMemo(() => transformCoursesForCarousel(course), [course])

  return (
    <CarouselWrapper title="All Course">
      {coursesToDisplay.map((course) => (
        <CourseCardSmall key={course.id} {...course} />
      ))}
    </CarouselWrapper>
  )
}

export const CourseCarousel = memo(CourseCarouselComponent)
