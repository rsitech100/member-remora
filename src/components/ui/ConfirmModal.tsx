'use client'

import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const typeStyles = {
    danger: {
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      iconColor: 'text-red-400',
      iconBg: 'bg-red-900/20',
      button: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-900/20',
      button: 'bg-amber-500 hover:bg-amber-600',
    },
    info: {
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-900/20',
      button: 'bg-[#2A9E8B] hover:bg-[#248276]',
    },
  }

  const style = typeStyles[type]

  return (
    <Modal isOpen={isOpen} onClose={onCancel} showCloseButton={false} variant="confirm">
      <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md  border border-gray-800">
        <div className={`${style.iconBg} rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
          <svg
            className={`w-6 h-6 ${style.iconColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={style.icon}
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 ${style.button} text-white rounded-lg font-medium transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
