'use client'

import { useState, useEffect } from 'react'
import { ICourse } from '@/types/api'
import AdminCourseList from './lists/AdminCourseList'
import AdminCourseModal from './modal/AdminCourseModal'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Container } from '@/components/layout/Container'

export default function AdminPage() {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/courses')
      const data = await response.json()
      if (data.success) {
        setCourses(data.data)
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleCreateCourse = () => {
    setSelectedCourse(null)
    setShowModal(true)
  }

  const handleEditCourse = (course: ICourse) => {
    setSelectedCourse(course)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedCourse(null)
  }

  const handleSaveSuccess = () => {
    fetchCourses()
    handleCloseModal()
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Course Management</h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage your courses and videos</p>
          </div>
          <Button
            onClick={handleCreateCourse}
            className="bg-[#2A9E8B] hover:bg-[#248276] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <Icon name="plus" className="w-5 h-5" />
            <span>Create Course</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#1a1a1a] rounded-xl h-64 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <AdminCourseList
            courses={courses}
            onEdit={handleEditCourse}
            onRefresh={fetchCourses}
          />
        )}

        {showModal && (
          <AdminCourseModal
            course={selectedCourse}
            onClose={handleCloseModal}
            onSuccess={handleSaveSuccess}
          />
        )}
      </div>
    </Container>
  )
}
