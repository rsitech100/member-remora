'use client'

import { ICourse } from '@/types/api'
import CourseCard from './CourseCard'

interface CourseListProps {
  courses: ICourse[]
  onEdit: (course: ICourse) => void
  onRefresh: () => void
}

export default function CourseList({ courses, onEdit, onRefresh }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-lg">No courses yet</div>
        <div className="text-gray-500 text-sm mt-2">Create your first course to get started</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEdit={onEdit}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  )
}
