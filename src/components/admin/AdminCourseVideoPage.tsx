'use client'

import { useState } from 'react'
import { ICourseDetailData, IVideo } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import Link from 'next/link'
import Image from 'next/image'
import AdminVideoModal from './modal/AdminVideoModal'
import AdminVideoList from './lists/AdminVideoList'
import { Container } from '@/components/layout/Container'

interface AdminCourseVideoPageProps {
  courseData: ICourseDetailData
}

export default function AdminCourseVideoPage({ courseData: initialData }: AdminCourseVideoPageProps) {
  const [courseData, setCourseData] = useState({
    ...initialData,
    videos: initialData.videos || []
  })
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null)

  const refreshCourseData = async () => {
    try {
      const response = await fetch(`/api/courses/${courseData.course.id}`)
      const data = await response.json()
      if (data.success) {
        setCourseData({
          ...data.data,
          videos: data.data.videos || []
        })
      }
    } catch (error) { 
      // Silent error handling
    }
  }

  const handleAddVideo = () => {
    setSelectedVideo(null)
    setShowVideoModal(true)
  }

  const handleCloseModal = () => {
    setShowVideoModal(false)
    setSelectedVideo(null)
  }

  const handleSaveSuccess = () => {
    refreshCourseData()
    handleCloseModal()
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <Icon name="arrow-left" className="w-5 h-5" />
          Back to Courses
        </Link>

      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
        <div className="flex gap-6">
          <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
            {courseData.course.image ? (
              <Image
                src={courseData.course.image}
                alt={courseData.course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="image" className="w-12 h-12 text-gray-600" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {courseData.course.title}
            </h1>
            <p className="text-lg text-gray-400 mb-2">{courseData.course.subtitle}</p>
            <p className="text-gray-500">{courseData.course.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Videos</h2>
            <p className="text-gray-400 mt-1">
              {courseData.videos.length} video{courseData.videos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={handleAddVideo}
            className="bg-[#2A9E8B] hover:bg-[#248276] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Icon name="plus" className="w-5 h-5" />
            Add Video
          </Button>
        </div>

        <AdminVideoList
          videos={courseData.videos}
          courseId={courseData.course.id}
          onRefresh={refreshCourseData}
        />
      </div>

      {showVideoModal && (
        <AdminVideoModal
          video={selectedVideo}
          courseId={courseData.course.id}
          onClose={handleCloseModal}
          onSuccess={handleSaveSuccess}
        />
      )}
      </div>
    </Container>
  )
}
