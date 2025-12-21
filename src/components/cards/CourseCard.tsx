import Image from 'next/image'
import Link from 'next/link'

interface CourseCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  instructor: string
  completed?: boolean
}

export function CourseCard({
  id,
  title,
  description,
  thumbnail,
  duration,
  instructor,
  completed = false,
}: CourseCardProps) {
  return (
    <Link 
      href={`/course/${id}`}
      className="block relative bg-[#22222C] rounded-xl overflow-hidden hover:bg-[#2a2a36] transition-colors cursor-pointer group"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative w-full sm:w-64 h-40 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#0d1820]">
          <Image
            src={thumbnail || '/images/dummy-image.png'}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/play-button.png"
              alt="Play"
              width={48}
              height={48}
              className="opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold text-base mb-2 group-hover:text-[#2A9E8B] transition-colors">
              {title}
            </h3>
            <p className="text-white text-sm line-clamp-2 mb-3">
              {description}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-white">
            <span>{instructor}</span>
            <span>⏱ {duration}</span>
          </div>
        </div>
      </div>

      {completed && (
        <div className="absolute bottom-0 right-0 px-4 py-1.5 bg-[#2A9E8B] text-white text-xs font-medium rounded-tl-lg rounded-bl-lg">
          Completed
        </div>
      )}
      {!completed && (
        <div className="absolute bottom-0 right-0 px-4 py-1.5 bg-[#2A9E8B] text-white text-xs font-medium rounded-tl-lg rounded-bl-lg">
          Now Watching
        </div>
      )}
    </Link>
  )
}
