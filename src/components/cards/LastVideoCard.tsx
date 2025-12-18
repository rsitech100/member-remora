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
    <div>
      <h2 className="text-[#2A9E8B] text-2xl font-semibold mb-4">Your Last Video</h2>
      
      <div>
        <div className="relative w-full h-48 overflow-hidden">
        <Image
          src="/images/dummy-image.png"
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
        <button className="absolute inset-0 w-full h-full flex items-center justify-center group">
          <Image
            src="/images/play-button.png"
            alt="Play"
            width={60}
            height={60}
            className="opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-white text-2xl font-semibold mb-3">{title}</h3>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#2A9E8B] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div>
            <div className="text-white font-medium text-sm">{instructor}</div>
            <div className="text-white text-xs">{instructorRole}</div>
          </div>
        </div>

        <hr className="border-gray-700 border-1 my-4 w-full" />
        <p className="text-white text-sm mb-6 leading-relaxed">{description}</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#2C2C36] rounded-lg p-4 ">
            <div className="w-12 h-12 bg-[#3a3a44] rounded-lg mb-3 justify-center flex items-center">
              <svg className="w-6 h-6 text-gray-300 justify-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs text-gray-400 mb-2">Duration</div>
            <div className="text-white text-sm font-semibold">{duration}</div>
          </div>
          
          <div className="bg-[#2C2C36] rounded-lg p-4 ">
            <div className="w-12 h-12 bg-[#3a3a44] rounded-lg mb-3 justify-center flex items-center">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-xs text-gray-400 mb-2">Module</div>
            <div className="text-white text-sm font-semibold">{totalLessons}</div>
          </div>
          
          <div className="bg-[#2C2C36] rounded-lg p-4 ">
            <div className="w-12 h-12 bg-[#3a3a44] rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div className="text-xs text-gray-400 mb-2">Language</div>
            <div className="text-white text-sm font-semibold">{language}</div>
          </div>
        </div>
      </div>
</div>
    </div>
  )
}
