import { APIError } from '@/lib/api'

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; auth?: boolean; status?: number }

export function toActionError(error: unknown, fallbackMessage: string): ActionResult<never> {
  if (error instanceof APIError) {
    return {
      ok: false,
      message: error.message,
      auth: error.isAuthError(),
      status: error.status,
    }
  }

  const message = error instanceof Error ? error.message : fallbackMessage
  return { ok: false, message }
}
