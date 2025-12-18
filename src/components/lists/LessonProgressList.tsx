interface LessonProgressItem {
  id: string
  title: string
  duration: string
  status: 'completed' | 'watching' | 'locked'
}

interface LessonProgressListProps {
  lessons: LessonProgressItem[]
}

export function LessonProgressList({ lessons }: LessonProgressListProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-[#2A9E8B] text-xl font-semibold">Your Progress</h3>
      
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`relative flex items-center gap-4 p-5 rounded-xl transition-colors ${
              lesson.status === 'watching'
                ? 'bg-[#2A9E8B] overflow-visible pr-[100vw] mr-[-100vw]'
                : 'bg-[#22222C] overflow-hidden'
            }`}
          >
            <div className="flex-shrink-0">
              {lesson.status === 'completed' && (
                <div className="w-8 h-8 rounded-full bg-[#3a3a44] flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {lesson.status === 'watching' && (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2A9E8B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.5 5.5l7 4.5-7 4.5V5.5z" />
                  </svg>
                </div>
              )}
              {lesson.status === 'locked' && (
                <div className="w-8 h-8 rounded-full border-2 border-gray-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-base font-medium ${
                lesson.status === 'watching' ? 'text-white' : 'text-gray-300'
              }`}>
                {lesson.title}
              </p>

              <span className={`text-sm ${
                lesson.status === 'watching' ? 'text-white/70' : 'text-gray-500'
              }`}>{lesson.duration}</span>
            </div>

            {lesson.status === 'completed' && (
              <div className="absolute bottom-0 right-0 px-3 py-1.5 bg-[#444455] text-white text-xs font-medium rounded-tl-lg rounded-bl-lg">
                Completed
              </div>
            )}
            {lesson.status === 'watching' && (
              <div className="absolute bottom-0 right-0 px-3 py-1.5 pr-[100vw] bg-[#1e7a6d] text-white text-xs font-medium rounded-tl-lg whitespace-nowrap">
                Now Watching
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
