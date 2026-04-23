'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/ToastProvider'
import { adminUpdateEmail } from '@/actions/admin'

interface UpdateEmailModalProps {
  adminEmail: string
  onClose: () => void
  onSuccess: () => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function UpdateEmailModal({ adminEmail, onClose, onSuccess }: UpdateEmailModalProps) {
  const { showToast } = useToast()
  const [existingEmail, setExistingEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [saving, setSaving] = useState(false)

  const trimmedExistingEmail = useMemo(() => existingEmail.trim(), [existingEmail])
  const trimmedNewEmail = useMemo(() => newEmail.trim(), [newEmail])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!trimmedExistingEmail) {
      showToast('Please enter existing email address', 'error')
      return
    }

    if (!emailRegex.test(trimmedExistingEmail)) {
      showToast('Please enter a valid existing email address', 'error')
      return
    }

    if (trimmedExistingEmail.toLowerCase() === adminEmail.toLowerCase()) {
      showToast('Existing email cannot be admin email', 'error')
      return
    }

    if (!trimmedNewEmail) {
      showToast('Please enter your new email address', 'error')
      return
    }

    if (!emailRegex.test(trimmedNewEmail)) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    if (trimmedNewEmail.toLowerCase() === trimmedExistingEmail.toLowerCase()) {
      showToast('New email must be different from existing email', 'error')
      return
    }

    try {
      setSaving(true)

      const result = await adminUpdateEmail(trimmedExistingEmail, trimmedNewEmail)

      if (!result.ok) {
        showToast(result.message || 'Failed to update email', 'error')
        return
      }

      showToast('Email updated successfully', 'success')
      onSuccess()
    } catch {
      showToast('Failed to update email', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen onClose={onClose}>
      <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Update Email</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
          </button>
        </div>

        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          Keep your account email up to date.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Existing Email *
            </label>
            <Input
              type="email"
              value={existingEmail}
              onChange={(event) => setExistingEmail(event.target.value)}
              placeholder="Enter existing email"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Email *
            </label>
            <Input
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              placeholder="Enter new email"
              required
              autoFocus
              className="w-full"
            />
          </div>

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
              isLoading={saving}
              className="flex-1 bg-[#2A9E8B] hover:bg-[#248276] text-white py-3 rounded-lg transition-colors"
            >
              Save Email
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
