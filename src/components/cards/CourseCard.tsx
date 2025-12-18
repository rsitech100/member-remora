import Image from 'next/image'

interface CourseCardProps {
  title: string
  description: string
  thumbnail: string
  duration: string
  instructor: string
  completed?: boolean
  onClick?: () => void
}

export function CourseCard({
  title,
  description,
  thumbnail,
  duration,
  instructor,
  completed = false,
  onClick
}: CourseCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      window.location.href = '/lesson/1'
    }
  }

  return (
    <div 
      className="bg-[#1a2332] rounded-xl overflow-hidden hover:bg-[#1f2937] transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative w-full sm:w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[#0d1820]">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold text-base mb-2 group-hover:text-[#2A9E8B] transition-colors">
              {title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{instructor}</span>
              <span>⏱ {duration}</span>
            </div>
            
            {completed && (
              <span className="px-3 py-1 bg-[#2A9E8B] text-white text-xs rounded-full font-medium">
                Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
