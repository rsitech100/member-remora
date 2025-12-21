'use client'

interface VideoDescriptionProps {
  title: string
  subtitle: string
  description: string
  previousVideoId?: string | null
  nextVideoId?: string | null
  onNextVideo?: () => void
  onPreviousVideo?: () => void
}

export function VideoDescription({ 
  title,
  subtitle,
  description,
  previousVideoId,
  nextVideoId,
  onNextVideo,
  onPreviousVideo
}: VideoDescriptionProps) {

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      <div className="animate-in fade-in slide-in-from-left-2 duration-500 delay-500">
        <p className="text-gray-400 text-sm">{title || 'Course'}</p>
        <h1 className="text-white text-2xl font-bold mt-1">{subtitle || 'Untitled Video'}</h1>
      </div>
      
      <hr className="border-gray-700 border-1 my-4 w-full animate-in fade-in duration-500 delay-600"/>
      
      <p className="text-gray-300 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700">
        {description || 'Description is unavailable.'}
      </p>
      
      <div className="flex gap-3 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700">
        {previousVideoId ? (
          <button
            onClick={onPreviousVideo}
            className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Video Sebelumnya
          </button>
        ) : (
          <button
            disabled
            className="flex-1 px-6 py-3 bg-gray-900 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2 opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Video Sebelumnya
          </button>
        )}
        
        {nextVideoId ? (
          <button
            onClick={onNextVideo}
            className="flex-1 px-6 py-3 bg-[#2A9E8B] hover:bg-[#238174] text-white rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-[#2A9E8B]/30 animate-in fade-in zoom-in-95 duration-500"
          >
            Video Selanjutnya
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            disabled
            className="flex-1 px-6 py-3 bg-gray-900 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2 opacity-50"
          >
            Video Selanjutnya
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
