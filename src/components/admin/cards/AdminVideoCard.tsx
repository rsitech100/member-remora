'use client'

import { useState } from 'react'
import { IVideo } from '@/types/api'
import { Icon } from '@/components/ui/Icon'
import { useToast } from '@/components/ui/ToastProvider'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

interface AdminVideoCardProps {
  video: IVideo
  index: number
  onRefresh: () => void
}

export default function AdminVideoCard({ video, index, onRefresh }: AdminVideoCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { showToast } = useToast()

  const handleDelete = async () => {
    setShowConfirm(false)

    try {
      setDeleting(true)
      const response = await fetch(`/api/admin/videos/${video.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        showToast('Video deleted successfully', 'success')
        onRefresh()
      } else {
        showToast('Failed to delete video: ' + data.message, 'error')
      }
    } catch (error) {
      showToast('Failed to delete video', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/20 text-green-400'
      case 'inactive':
        return 'bg-gray-900/20 text-gray-400'
      default:
        return 'bg-gray-900/20 text-gray-400'
    }
  }

  const getHLSStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-900/20 text-green-400'
      case 'processing':
        return 'bg-yellow-900/20 text-yellow-400'
      case 'failed':
        return 'bg-red-900/20 text-red-400'
      default:
        return 'bg-gray-900/20 text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'public'
      case 'inactive':
        return 'private'
      default:
        return status
    }
  }

  const getHLSStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Video Ready'
      case 'pending':
        return 'Video Pending'
      case 'processing':
        return 'Video Processing'
      case 'failed':
        return 'Video Failed'
      default:
        return status
    }
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 hover:border-[#2A9E8B] transition-all">
      <div className="flex gap-4">
        {/* Video Number */}
        <div className="flex-shrink-0 w-12 h-12 bg-[#2A9E8B]/10 rounded-lg flex items-center justify-center">
          <span className="text-[#2A9E8B] font-bold text-lg">{index + 1}</span>
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {video.title}
              </h3>
              {video.subtitle && (
                <p className="text-sm text-gray-400 truncate">{video.subtitle}</p>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex gap-2 flex-shrink-0">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                  video.status
                )}`}
              >
                {getStatusText(video.status)}
              </span>
              {video.hls_status && (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getHLSStatusColor(
                    video.hls_status
                  )}`}
                >
                  {getHLSStatusText(video.hls_status)}
                </span>
              )}
            </div>
          </div>

          {video.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {video.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Icon name="trash" className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Video"
        message="Are you sure you want to delete this video? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}
