'use client'

import { memo, useMemo, useCallback } from 'react'
import { IVideo } from '@/types/api'
import { transformVideosForProgress } from './utils'

interface VideoProgressListProps {
  courseVideos: IVideo[]
  currentVideoId: string
  courseTitle: string
  onVideoClick?: (videoId: string) => void
}

const VideoProgressListComponent = ({
  courseVideos, 
  currentVideoId, 
  courseTitle,
  onVideoClick 
}: VideoProgressListProps) => {
  const courses = useMemo(
    () => transformVideosForProgress(courseVideos, currentVideoId, courseTitle),
    [courseVideos, currentVideoId, courseTitle]
  )

  const handleCourseClick = useCallback((courseId: string, isAccessible: boolean) => {
    if (!isAccessible || !onVideoClick) return
    onVideoClick(courseId)
  }, [onVideoClick])

  return (
    <div className="space-y-6">
      <h3 className="text-[#2A9E8B] text-xl font-semibold animate-in fade-in slide-in-from-right-4 duration-500">Your Progress</h3>
      
      <div className="space-y-3">
        {courses.map((course, index) => {
          const isLocked = course.isAccessible === false
          
          return (
            <button
              key={course.id}
              onClick={() => handleCourseClick(course.id, course.isAccessible)}
              disabled={isLocked}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
              className={`w-full relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left animate-in fade-in slide-in-from-right-4 hover:scale-[1.02] ${
                isLocked
                  ? 'bg-[#1a1a24] cursor-not-allowed opacity-50'
                  : course.status === 'now_watching'
                  ? 'bg-[#2A9E8B] hover:bg-[#22b399] hover:shadow-lg hover:shadow-[#2A9E8B]/20'
                  : course.status === 'completed'
                  ? 'bg-[#22222C] hover:bg-[#2a2a36] hover:shadow-lg'
                  : 'bg-[#1a1a24] hover:bg-[#22222C] hover:shadow-lg'
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
                {!isLocked && course.status === 'now_watching' && (
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#2A9E8B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.5 5.5l7 4.5-7 4.5V5.5z" />
                    </svg>
                  </div>
                )}
                {!isLocked && course.status === 'not_started' && (
                  <div className="w-8 h-8 rounded-full bg-[#2a2a34] flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium line-clamp-2 ${
                  isLocked 
                    ? 'text-gray-600'
                    : course.status === 'now_watching' ? 'text-white' 
                    : course.status === 'completed' ? 'text-gray-300'
                    : 'text-gray-400'
                }`}>
                  {course.title}
                </p>
                <span className={`text-xs mt-1 block ${
                  isLocked
                    ? 'text-gray-700'
                    : course.status === 'now_watching' ? 'text-white/70' 
                    : course.status === 'completed' ? 'text-gray-500'
                    : 'text-gray-600'
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
              {!isLocked && course.status === 'now_watching' && (
                <div className="absolute bottom-0 right-0 px-3 py-1.5 bg-white text-[#2A9E8B] text-xs font-medium rounded-tl-lg rounded-br-xl">
                  Now Watching
                </div>
              )}
              {!isLocked && course.status === 'not_started' && (
                <div className="absolute bottom-0 right-0 px-3 py-1.5 bg-[#2a2a34] text-gray-400 text-xs font-medium rounded-tl-lg rounded-br-xl">
                  Not Started
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const VideoProgressList = memo(VideoProgressListComponent)
