'use server'

import { removeAuthToken } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function clearSessionAction() {
  await removeAuthToken()
  redirect('/login')
}
