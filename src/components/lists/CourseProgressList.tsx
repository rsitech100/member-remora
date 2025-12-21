'use client'

import { useRouter } from 'next/navigation'

interface CourseProgressItem {
  id: string
  title: string
  duration: string
  status: 'completed' | 'watching'
  isAccessible?: boolean
}

interface CourseProgressListProps {
  courses: CourseProgressItem[]
  onVideoClick?: (videoId: string) => void
}

export function CourseProgressList({ courses, onVideoClick }: CourseProgressListProps) {
  const router = useRouter()

  const handleCourseClick = (course: CourseProgressItem) => {
    if (course.isAccessible === false) return
    
    if (onVideoClick) {
      onVideoClick(course.id)
    } else {
      router.push(`/course/${course.id}`)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-[#2A9E8B] text-xl font-semibold animate-in fade-in slide-in-from-right-4 duration-500">Your Progress</h3>
      
      <div className="space-y-3">
        {courses.map((course, index) => {
          const isLocked = course.isAccessible === false
          
          return (
            <button
              key={course.id}
              onClick={() => handleCourseClick(course)}
              disabled={isLocked}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
              className={`w-full relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left animate-in fade-in slide-in-from-right-4 hover:scale-[1.02] ${
                isLocked
                  ? 'bg-[#1a1a24] cursor-not-allowed opacity-50'
                  : course.status === 'watching'
                  ? 'bg-[#2A9E8B] hover:bg-[#22b399] hover:shadow-lg hover:shadow-[#2A9E8B]/20'
                  : 'bg-[#22222C] hover:bg-[#2a2a36] hover:shadow-lg'
              }`}
            >
              <div className="flex-shrink-0">
                {isLocked && (
                  <div className="w-8 h-8 rounded-full bg-[#2a2a34] flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {!isLocked && course.status === 'completed' && (
                  <div className="w-8 h-8 rounded-full bg-[#3a3a44] flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {!isLocked && course.status === 'watching' && (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2A9E8B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.5 5.5l7 4.5-7 4.5V5.5z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium line-clamp-2 ${
                isLocked 
                  ? 'text-gray-600'
                  : course.status === 'watching' ? 'text-white' : 'text-gray-300'
              }`}>
                {course.title}
              </p>
              <span className={`text-xs mt-1 block ${
                isLocked
                  ? 'text-gray-700'
                  : course.status === 'watching' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {course.duration}
              </span>
            </div>

            {isLocked && (
              <div className="absolute bottom-0 right-0 px-3 py-1.5 bg-[#2a2a34] text-gray-600 text-xs font-medium rounded-tl-lg rounded-br-xl">
                Locked
              </div>
            )}
            {!isLocked && course.status === 'completed' && (
              <div className="absolute bottom-0 right-0 px-3 py-1.5 bg-[#444455] text-white text-xs font-medium rounded-tl-lg rounded-br-xl">
                Completed
              </div>
            )}
            {!isLocked && course.status === 'watching' && (
              <div className="absolute bottom-0 right-0 px-3 py-1.5 bg-white text-[#2A9E8B] text-xs font-medium rounded-tl-lg rounded-br-xl">
                Now Watching
              </div>
            )}
          </button>
        )
        })}
      </div>
    </div>
  )
}
