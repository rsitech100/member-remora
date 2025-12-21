'use client'

import { useRouter } from 'next/navigation'

interface VideoErrorViewProps {
  courseTitle?: string
  videoTitle?: string
  previousVideoId?: string | null
  nextVideoId?: string | null
}

export function VideoErrorView({ 
  courseTitle = 'Course',
  videoTitle = 'Video Not Available',
  previousVideoId,
  nextVideoId 
}: VideoErrorViewProps) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <h2 className="text-[#2A9E8B] text-xl font-semibold">You're Watching</h2>
      
      <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center border border-gray-700">
        <div className="text-center px-8">
          <div className="mb-4">
            <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm mb-2">Video currently unavailable</p>
          <p className="text-gray-500 text-xs">The video is being processed or temporarily unavailable</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">{courseTitle}</p>
          <h1 className="text-white text-2xl font-bold mt-1">{videoTitle || 'Video Processing'}</h1>
        </div>
        
        <hr className="border-gray-700 border-1 my-4 w-full"/>
        
        <p className="text-gray-300 text-sm leading-relaxed">
          This video is currently being processed or is temporarily unavailable.
        </p>
        
        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-6">
          {previousVideoId ? (
            <button
              onClick={() => router.push(`/course/${previousVideoId}`)}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Video Sebelumnya
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-6 py-3 bg-gray-900 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Video Sebelumnya
            </button>
          )}
          
          {nextVideoId ? (
            <button
              onClick={() => router.push(`/course/${nextVideoId}`)}
              className="flex-1 px-6 py-3 bg-[#2A9E8B] hover:bg-[#238174] text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              Video Selanjutnya
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-6 py-3 bg-gray-900 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2"
            >
              Video Selanjutnya
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
