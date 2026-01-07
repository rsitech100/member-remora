'use client'

import { createContext, useContext, ReactNode } from 'react'

interface CourseMapping {
  [slug: string]: number
}

interface CourseContextValue {
  courseMapping: CourseMapping
  getCourseIdBySlug: (slug: string) => number | null
  getSlugByCourseId: (id: number) => string | null
}

const CourseContext = createContext<CourseContextValue | undefined>(undefined)

export function useCourseContext() {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourseContext must be used within CourseProvider')
  }
  return context
}

interface CourseProviderProps {
  children: ReactNode
  courseMapping: CourseMapping
}

export function CourseProvider({ children, courseMapping }: CourseProviderProps) {
  const getCourseIdBySlug = (slug: string): number | null => {
    return courseMapping[slug] ?? null
  }

  const getSlugByCourseId = (id: number): string | null => {
    const entry = Object.entries(courseMapping).find(([, courseId]) => courseId === id)
    return entry ? entry[0] : null
  }

  return (
    <CourseContext.Provider value={{ courseMapping, getCourseIdBySlug, getSlugByCourseId }}>
      {children}
    </CourseContext.Provider>
  )
}
