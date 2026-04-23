import Image from 'next/image'
import Link from 'next/link'
import { generateCourseSlug } from '@/lib/utils'

interface CourseCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  instructor: string
  status?: 'completed' | 'now_watching' | 'in_progress' | 'not_started'
}

export function CourseCard({
  title,
  description,
  thumbnail,
  duration,
  instructor,
  status = 'not_started',
}: CourseCardProps) {
  const courseSlug = generateCourseSlug(title)
  
  return (
    <Link 
      href={`/course/${courseSlug}`}
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
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.92241 0C3.94885 0 2.99715 0.288694 2.18767 0.829575C1.37818 1.37046 0.747264 2.13923 0.374698 3.03868C0.0021328 3.93814 -0.0953473 4.92787 0.0945849 5.88272C0.284517 6.83757 0.753331 7.71466 1.44174 8.40308C2.13015 9.09149 3.00724 9.5603 3.9621 9.75023C4.91695 9.94017 5.90668 9.84268 6.80613 9.47012C7.70559 9.09755 8.47436 8.46664 9.01524 7.65715C9.55612 6.84766 9.84482 5.89597 9.84482 4.92241C9.84482 4.27599 9.7175 3.6359 9.47012 3.03868C9.22275 2.44147 8.86016 1.89883 8.40308 1.44174C7.94599 0.984652 7.40335 0.62207 6.80613 0.374696C6.20892 0.127322 5.56883 0 4.92241 0ZM7.38361 5.41465H4.92241C4.79186 5.41465 4.66666 5.36279 4.57434 5.27047C4.48203 5.17816 4.43017 5.05296 4.43017 4.92241V1.96896C4.43017 1.83841 4.48203 1.71321 4.57434 1.6209C4.66666 1.52858 4.79186 1.47672 4.92241 1.47672C5.05296 1.47672 5.17816 1.52858 5.27048 1.6209C5.36279 1.71321 5.41465 1.83841 5.41465 1.96896V4.43017H7.38361C7.51416 4.43017 7.63937 4.48203 7.73168 4.57434C7.82399 4.66665 7.87585 4.79186 7.87585 4.92241C7.87585 5.05296 7.82399 5.17816 7.73168 5.27047C7.63937 5.36279 7.51416 5.41465 7.38361 5.41465Z" fill="white"/>
              </svg>
              {duration}
            </span>
          </div>
        </div>
      </div>

      {status === 'completed' && (
        <div className="absolute bottom-0 right-0 px-4 py-1.5 bg-gray-500 text-white text-xs font-medium rounded-tl-lg rounded-bl-lg">
          Completed
        </div>
      )}
      {status === 'now_watching' && (
        <div className="absolute bottom-0 right-0 px-4 py-1.5 bg-[#2A9E8B] text-white text-xs font-medium rounded-tl-lg rounded-bl-lg">
          Now Watching
        </div>
      )}
      {status === 'in_progress' && (
        <div className="absolute bottom-0 right-0 px-4 py-1.5 bg-[#555566] text-white text-xs font-medium rounded-tl-lg rounded-bl-lg">
          In Progress
        </div>
      )}
      {status === 'not_started' && (
        <div className="absolute bottom-0 right-0 px-4 py-1.5 bg-[#555566] text-white text-xs font-medium rounded-tl-lg rounded-bl-lg">
          Not Started
        </div>
      )}
    </Link>
  )
}
