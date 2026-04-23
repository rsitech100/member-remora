'use server'

import { fetchWithAuth } from '@/lib/api'
import type { IAPIResponse, ICourse } from '@/types/api'
import type { ActionResult } from '@/actions/shared'
import { toActionError } from '@/actions/shared'

export type UploadSessionData = {
  video_id: number
  upload_link: string
  s3_client_payload: Record<string, unknown>
  expires_in?: number
  vdocipher_video_id?: string
}

export async function adminFetchCourses(): Promise<ActionResult<ICourse[]>> {
  try {
    const response = await fetchWithAuth<IAPIResponse<ICourse[]>>('/api/v2/admin/course')
    return { ok: true, data: response.data }
  } catch (error) {
    return toActionError(error, 'Failed to fetch courses')
  }
}

export async function adminFetchCourse(courseId: number): Promise<ActionResult<unknown>> {
  try {
    const response = await fetchWithAuth<IAPIResponse<unknown>>(`/api/v2/admin/course/${courseId}`)
    return { ok: true, data: response.data }
  } catch (error) {
    return toActionError(error, 'Failed to fetch course')
  }
}

export async function adminDeleteCourse(courseId: number): Promise<ActionResult<null>> {
  try {
    await fetchWithAuth(`/api/v2/admin/course/${courseId}`, { method: 'DELETE' })
    return { ok: true, data: null }
  } catch (error) {
    return toActionError(error, 'Failed to delete course')
  }
}

export async function adminDeleteVideo(videoId: number): Promise<ActionResult<null>> {
  try {
    await fetchWithAuth(`/api/v2/admin/video/${videoId}`, { method: 'DELETE' })
    return { ok: true, data: null }
  } catch (error) {
    return toActionError(error, 'Failed to delete video')
  }
}

export async function adminConvertVideoToHls(videoId: number): Promise<ActionResult<null>> {
  try {
    await fetchWithAuth(`/api/v2/admin/video/${videoId}/otp`, { method: 'POST' })
    return { ok: true, data: null }
  } catch (error) {
    return toActionError(error, 'Failed to convert video')
  }
}

export async function adminUpdateVideo(
  videoId: number,
  payload: Record<string, unknown>
): Promise<ActionResult<null>> {
  try {
    const response = await fetchWithAuth<IAPIResponse<unknown>>(`/api/v2/admin/video/${videoId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    if (response.success === false) {
      return { ok: false, message: response.message || 'Failed to update video' }
    }
    return { ok: true, data: null }
  } catch (error) {
    return toActionError(error, 'Failed to update video')
  }
}

export async function adminInitVideoUploadSession(
  courseId: number,
  payload: Record<string, unknown>
): Promise<ActionResult<UploadSessionData>> {
  try {
    const response = await fetchWithAuth<IAPIResponse<UploadSessionData>>(`/api/v2/admin/video?course_id=${encodeURIComponent(String(courseId))}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (!response.success || !response.data?.upload_link || !response.data?.video_id) {
      return { ok: false, message: response.message || 'Failed to initialize video upload' }
    }

    return { ok: true, data: response.data }
  } catch (error) {
    return toActionError(error, 'Failed to initialize video upload')
  }
}

export async function adminSyncVideoState(videoId: number): Promise<ActionResult<null>> {
  try {
    await fetchWithAuth(`/api/v2/admin/video/${videoId}`, { method: 'GET' })
    return { ok: true, data: null }
  } catch (error) {
    return toActionError(error, 'Failed to sync video')
  }
}

export async function adminUpdateEmail(currentEmail: string, newEmail: string): Promise<ActionResult<null>> {
  try {
    const response = await fetchWithAuth<IAPIResponse<unknown>>('/api/update-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        current_email: currentEmail,
        new_email: newEmail,
      }),
    })

    if (response.success === false) {
      return { ok: false, message: response.message || 'Failed to update email' }
    }

    return { ok: true, data: null }
  } catch (error) {
    return toActionError(error, 'Failed to update email')
  }
}

export async function adminCreateCourse(payload: Record<string, unknown>): Promise<ActionResult<null>> {
  try {
    const response = await fetchWithAuth<IAPIResponse<unknown>>('/api/v2/admin/course', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (response.success === false) {
      return { ok: false, message: response.message || 'Failed to create course' }
    }
    return { ok: true, data: null }
  } catch (error) {
    return toActionError(error, 'Failed to create course')
  }
}

export async function adminUpdateCourse(courseId: number, payload: Record<string, unknown>): Promise<ActionResult<null>> {
  try {
    const response = await fetchWithAuth<IAPIResponse<unknown>>(`/api/v2/admin/course/${courseId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    if (response.success === false) {
      return { ok: false, message: response.message || 'Failed to update course' }
    }
    return { ok: true, data: null }
  } catch (error) {
    return toActionError(error, 'Failed to update course')
  }
}
