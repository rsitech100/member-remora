'use client'

import { useState } from 'react'
import { ICourse } from '@/types/api'
import { Icon } from '@/components/ui/Icon'
import Image from 'next/image'
import Link from 'next/link'

interface CourseCardProps {
  course: ICourse
  onEdit: (course: ICourse) => void
  onRefresh: () => void
}

export default function CourseCard({ course, onEdit, onRefresh }: CourseCardProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all associated videos.')) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/admin/courses/${course.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        onRefresh()
      } else {
        alert('Failed to delete course: ' + data.message)
      }
    } catch (error) {
      console.error('Failed to delete course:', error)
      alert('Failed to delete course')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-[#2A9E8B] transition-all group">
      {/* Course Image */}
      <div className="relative h-40 bg-gray-800">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="image" className="w-12 h-12 text-gray-600" />
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white line-clamp-1">
            {course.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-1">{course.subtitle}</p>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
          {course.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Icon name="video" className="w-4 h-4" />
          <span>{course.videos?.length || 0} videos</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/admin/courses/${course.id}`}
            className="flex-1 bg-[#2A9E8B] hover:bg-[#248276] text-white text-sm font-medium py-2 rounded-lg text-center transition-colors"
          >
            Manage Videos
          </Link>
          <button
            onClick={() => onEdit(course)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            title="Edit Course"
          >
            <Icon name="edit" className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
            title="Delete Course"
          >
            <Icon name="trash" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
