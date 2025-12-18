import Image from 'next/image'

interface LessonCardSmallProps {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  instructor: string
  completed?: boolean
}

export function LessonCardSmall({
  id,
  title,
  description,
  thumbnail,
  duration,
  instructor,
  completed = false
}: LessonCardSmallProps) {
  const handleClick = () => {
    window.location.href = `/lesson/${id}`
  }

  return (
    <div 
      onClick={handleClick}
      className="relative flex-shrink-0 w-72 bg-[#22222C] rounded-xl overflow-hidden cursor-pointer hover:bg-[#2a2a36] transition-colors"
    >
      <div className="relative w-full h-40">
        <Image
          src="/images/dummy-image.png"
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/play-button.png"
            alt="Play"
            width={40}
            height={40}
            className="opacity-90"
          />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{instructor}</span>
          <span>⏱ {duration}</span>
        </div>
      </div>

      {completed && (
        <div className="absolute bottom-0 right-0 px-3 py-1.5 bg-[#2A9E8B] text-white text-xs font-medium rounded-tl-lg rounded-bl-lg">
          Completed
        </div>
      )}
    </div>
  )
}
