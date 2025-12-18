'use client'

import { VideoPlayer } from './VideoPlayer'
import { LessonProgressList } from '../lists/LessonProgressList'
import { Container } from '../layout/Container'

const lessons = [
  {
    id: '1',
    title: 'Lorem Ipsum Dolor Sit Amet',
    duration: '11 Mins',
    status: 'completed' as const,
  },
  {
    id: '2',
    title: 'Lorem Ipsum Dolor Sit Amet',
    duration: '11 Mins',
    status: 'completed' as const,
  },
  {
    id: '3',
    title: 'Lorem Ipsum Dolor Sit Amet',
    duration: '11 Mins',
    status: 'watching' as const,
  },
]

export function VideoPlayerView() {
  return (
    <Container className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VideoPlayer
            thumbnail="/images/lesson-video.jpg"
            title="Learning how to basic trading in 30 minutes"
            moduleNumber="Module 3"
          />
        </div>

        <div className="lg:col-span-1 lg:pr-0">
          <div className="sticky top-24">
            <LessonProgressList lessons={lessons} />
          </div>
        </div>
      </div>
    </Container>
  )
}
