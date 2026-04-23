import { cache } from 'react'
import { fetchWithAuth } from './api'
import { IAPIResponse, ICourse } from '@/types/api'
import { generateCourseSlug } from './utils'

export const getCourseMapping = cache(async (): Promise<{ [slug: string]: number }> => {
  try {
    const response = await fetchWithAuth<IAPIResponse<ICourse[]>>('/api/v2/user/course')
    const mapping: { [slug: string]: number } = {}
    
    response.data.forEach(course => {
      const slug = generateCourseSlug(course.title)
      mapping[slug] = course.id
    })
    
    return mapping
  } catch {
    return {}
  }
})

export async function getCourseIdFromSlug(slug: string): Promise<number | null> {
  const mapping = await getCourseMapping()
  return mapping[slug] ?? null
}
