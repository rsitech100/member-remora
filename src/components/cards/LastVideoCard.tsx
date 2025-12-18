import Image from 'next/image'

interface LastVideoCardProps {
  title: string
  description: string
  instructor: string
  instructorRole: string
  thumbnail: string
  duration: string
  totalLessons: string
  language: string
}

export function LastVideoCard({
  title,
  description,
  instructor,
  instructorRole,
  thumbnail,
  duration,
  totalLessons,
  language
}: LastVideoCardProps) {
  return (
    <div className="bg-[#0a0e14] rounded-2xl p-6">
      <h2 className="text-[#2A9E8B] text-xl font-semibold mb-4">Your Last Video</h2>
      
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
        />
        <button className="absolute inset-0 w-full h-full flex items-center justify-center group">
          <div className="w-16 h-16 rounded-full bg-[#2A9E8B] group-hover:bg-[#248276] transition-colors flex items-center justify-center">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#2A9E8B] flex items-center justify-center text-white font-semibold">
          {instructor[0]}
        </div>
        <div>
          <div className="text-white font-medium text-sm">{instructor}</div>
          <div className="text-gray-400 text-xs">{instructorRole}</div>
        </div>
      </div>

      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{description}</p>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1a2332] rounded-lg p-3 text-center">
          <svg className="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-gray-500 mb-1">Duration</div>
          <div className="text-white text-sm font-semibold">{duration}</div>
        </div>
        
        <div className="bg-[#1a2332] rounded-lg p-3 text-center">
          <svg className="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="text-xs text-gray-500 mb-1">Lessons</div>
          <div className="text-white text-sm font-semibold">{totalLessons}</div>
        </div>
        
        <div className="bg-[#1a2332] rounded-lg p-3 text-center">
          <svg className="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <div className="text-xs text-gray-500 mb-1">Language</div>
          <div className="text-white text-sm font-semibold">{language}</div>
        </div>
      </div>
    </div>
  )
}
