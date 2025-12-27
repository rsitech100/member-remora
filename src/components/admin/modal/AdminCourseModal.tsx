'use client'

import { useState, useRef, useEffect } from 'react'
import { ICourse } from '@/types/api'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import Image from 'next/image'

interface AdminCourseModalProps {
  course: ICourse | null
  onClose: () => void
  onSuccess: () => void
}

export default function AdminCourseModal({ course, onClose, onSuccess }: AdminCourseModalProps) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    subtitle: course?.subtitle || '',
    description: course?.description || '',
    image: course?.image || '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(course?.image || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditing = !!course

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image

    try {
      setUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append('file', imageFile)

      const response = await fetch('/api/upload-original', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()
      if (data.success && data.data?.file_url) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
        return `${baseUrl}${data.data.file_url}`
      }
      throw new Error(data.message || 'Upload failed')
    } catch (error) {
      console.error('Image upload failed:', error)
      alert('Failed to upload image')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      let imageUrl = formData.image
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (!uploadedUrl) return
        imageUrl = uploadedUrl
      }

      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        image: imageUrl,
      }

      const url = isEditing
        ? `/api/admin/courses/${course.id}`
        : '/api/admin/courses'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (data.success) {
        onSuccess()
      } else {
        alert('Failed to save course: ' + data.message)
      }
    } catch (error) {
      console.error('Failed to save course:', error)
      alert('Failed to save course')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen onClose={onClose}>
      <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Course' : 'Create Course'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Course Image
            </label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-700 hover:border-[#2A9E8B] rounded-lg text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="image" className="w-5 h-5" />
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Course Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course title"
              required
              className="w-full"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subtitle *
            </label>
            <Input
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Enter course subtitle"
              required
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter course description"
              required
              rows={4}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2A9E8B] transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading || saving}
              className="flex-1 bg-[#2A9E8B] hover:bg-[#248276] text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : saving ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
