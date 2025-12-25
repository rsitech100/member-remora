'use client'

import { useState, useRef } from 'react'
import { IVideo } from '@/types/api'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'

interface VideoModalProps {
  video: IVideo | null
  courseId: number
  onClose: () => void
  onSuccess: () => void
}

export default function VideoModal({ video, courseId, onClose, onSuccess }: VideoModalProps) {
  const [formData, setFormData] = useState({
    title: video?.title || '',
    subtitle: video?.subtitle || '',
    description: video?.description || '',
    status: video?.status || 'active',
    order: video?.order || 0,
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditing = !!video

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
    }
  }

  const uploadVideo = async (): Promise<string | null> => {
    if (!videoFile) return video?.original_video || null

    try {
      setUploading(true)
      setUploadProgress(0)

      const uploadFormData = new FormData()
      uploadFormData.append('file', videoFile)

      const response = await fetch('/api/upload-original', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()
      setUploadProgress(100)

      if (data.success && data.data?.file_url) {
        return data.data.file_url
      }
      throw new Error(data.message || 'Upload failed')
    } catch (error) {
      console.error('Video upload failed:', error)
      alert('Failed to upload video')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isEditing && !videoFile) {
      alert('Please select a video file')
      return
    }

    try {
      setSaving(true)

      // Upload video if a new one was selected
      let videoUrl = video?.original_video || ''
      if (videoFile) {
        const uploadedUrl = await uploadVideo()
        if (!uploadedUrl) return
        videoUrl = uploadedUrl
      }

      const payload = {
        course_id: courseId,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        original_video: videoUrl,
        status: formData.status,
        order: formData.order,
      }

      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (data.success) {
        onSuccess()
      } else {
        alert('Failed to save video: ' + data.message)
      }
    } catch (error) {   
      console.error('Failed to save video:', error)
      alert('Failed to save video')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen onClose={onClose}>
      <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Video' : 'Add Video'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video File *
              </label>
              <div className="space-y-3">
                {videoFile && (
                  <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <Icon name="video" className="w-6 h-6 text-[#2A9E8B]" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm truncate">
                          {videoFile.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    {uploading && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-[#2A9E8B] h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Uploading... {uploadProgress}%
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-700 hover:border-[#2A9E8B] rounded-lg text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Icon name="upload" className="w-5 h-5" />
                  {videoFile ? 'Change Video' : 'Select Video File'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter video title"
              required
              className="w-full"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subtitle
            </label>
            <Input
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Enter video subtitle (optional)"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter video description (optional)"
              rows={4}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2A9E8B] transition-colors"
            />
          </div>

          {/* Status and Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A9E8B] transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order (optional)
              </label>
              <Input
                type="text"
                value={formData.order}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setFormData({ ...formData, order: parseInt(value) || 0 })
                }}
                placeholder="Leave empty for auto-order"
                className="w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading || saving}
              className="flex-1 bg-[#2A9E8B] hover:bg-[#248276] text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? `Uploading... ${uploadProgress}%` : saving ? 'Saving...' : isEditing ? 'Update Video' : 'Add Video'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
