'use client'

import { useState } from 'react'
import { ICourse } from '@/types/api'
import AdminCourseList from './lists/AdminCourseList'
import AdminCourseModal from './modal/AdminCourseModal'
import UpdateEmailModal from './modal/UpdateEmailModal'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Container } from '@/components/layout/Container'

interface AdminPageProps {
  initialCourses: ICourse[]
  initialEmail?: string
}

export default function AdminPage({ initialCourses, initialEmail = '' }: AdminPageProps) {
  const [courses, setCourses] = useState<ICourse[]>(initialCourses)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/courses', {
        cache: 'no-store'
      })
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

  const handleEmailUpdateSuccess = () => {
    setShowEmailModal(false)
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Course Management</h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage your courses and videos</p>
          </div>
          <div className="flex w-full sm:w-auto gap-3">
            <Button
              onClick={() => setShowEmailModal(true)}
              className="bg-transparent border border-[#2A9E8B]/50 hover:border-[#2A9E8B] text-[#67d2c2] hover:text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors hover:bg-[#2A9E8B]/20 w-full sm:w-auto"
            >
              <Icon name="mail" className="w-5 h-5" />
              <span>Update Email</span>
            </Button>

            <Button
              onClick={handleCreateCourse}
              className="bg-[#2A9E8B] hover:bg-[#248276] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
            >
              <Icon name="plus" className="w-5 h-5" />
              <span>Create Course</span>
            </Button>
          </div>
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

        {showEmailModal && (
          <UpdateEmailModal
            adminEmail={initialEmail}
            onClose={() => setShowEmailModal(false)}
            onSuccess={handleEmailUpdateSuccess}
          />
        )}
      </div>
    </Container>
  )
}
