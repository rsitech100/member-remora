import Image from 'next/image'

interface LessonCardSmallProps {
  title: string
  description: string
  thumbnail: string
  duration: string
  instructor: string
  completed?: boolean
}

export function LessonCardSmall({
  title,
  description,
  thumbnail,
  duration,
  instructor,
  completed = false
}: LessonCardSmallProps) {
  return (
    <div className="flex-shrink-0 w-64 bg-[#1a2332] rounded-xl overflow-hidden">
      <div className="relative w-full h-36">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{instructor}</span>
            <span>⏱ {duration}</span>
          </div>
          
          {completed && (
            <span className="px-2 py-1 bg-gray-700 text-white text-xs rounded">
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
