import Image from 'next/image'
import Link from 'next/link'

interface CourseCardSmallProps {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  instructor: string
  completed?: boolean
  status?: 'completed' | 'now_watching' | 'not_started'
}

export function CourseCardSmall({
  id,
  title,
  description,
  thumbnail,
  duration,
  instructor,
  completed = false,
  status
}: CourseCardSmallProps) {
  return (
    <Link 
      href={`/course/${encodeURIComponent(title)}`}
      className="block relative flex-shrink-0 w-[340px] bg-[#2C2C38] rounded-xl overflow-hidden cursor-pointer hover:bg-[#353543] transition-all p-3"
    >
      <div className="relative w-full h-[180px] rounded-lg overflow-hidden mb-3">
        <Image
          src={thumbnail || '/images/dummy-image.png'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="pb-3 pr-28">
        <h3 className="text-white font-bold text-base mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-300 truncate">{instructor}</span>
          <span className="flex items-center gap-1 text-white flex-shrink-0">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {duration}
          </span>
        </div>
      </div>

      {(completed || status === 'completed') && (
        <div className="absolute bottom-0 right-0 px-4 py-1.5 bg-[#5A5A6A] text-white text-sm font-medium rounded-tl-lg">
          Completed
        </div>
      )}
      {status === 'now_watching' && (
        <div className="absolute bottom-0 right-0 px-4 py-1.5 bg-[#2A9E8B] text-white text-sm font-medium rounded-tl-lg">
          Now Watching
        </div>
      )}
    </Link>
  )
}
