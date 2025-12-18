import { LessonItem } from '../dashboard/LessonItem'

const lessons = [
  {
    id: '1',
    title: 'Lesson Demo Here',
    description: 'Module 3Lorem Ipsum Dolor Sit AmetLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodtempor incididunt ut labore et dolore magna...',
    duration: '00:10',
    thumbnail: '/images/lesson-thumb.jpg',
  },
  {
    id: '2',
    title: 'Lesson Demo Here',
    description: 'Description/Detail about your content class here',
    duration: '00:10',
  },
  {
    id: '3',
    title: 'Lesson Demo Here',
    description: 'Description/Detail about your content class here',
    duration: '00:10',
  },
]

export function LessonList() {
  return (
    <div className="bg-[#0f1419] rounded-xl overflow-hidden">
      {lessons.map((lesson) => (
        <LessonItem key={lesson.id} lesson={lesson} />
      ))}
    </div>
  )
}
