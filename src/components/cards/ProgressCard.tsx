import { CircularProgress } from '@/components/ui/CircularProgress'

interface ProgressCardProps {
  percentage: number
  completed: number
  total: number
  isMobile?: boolean
}

export function ProgressCard({ percentage, completed, total, isMobile = false }: ProgressCardProps) {
  if (isMobile) {
    return (
      <div>
        <h3 className="text-[#2A9E8B] text-xl font-semibold mb-4">Your Progress</h3>
        
        <div className="bg-[#22222C] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className={`text-[#2A9E8B] ${percentage >= 100 ? 'text-6xl' : 'text-7xl'} font-bold leading-none mb-3`}>
                {percentage}%
              </div>
              <div className="text-white text-base font-medium">
                {completed}/{total} Video
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <CircularProgress percentage={percentage} size={120} strokeWidth={10} />
            </div>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            Progress belajar kamu luar biasa! Teruskan menonton modul untuk membuka level pengetahuan berikutnya.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <h3 className="text-[#2A9E8B] text-3xl font-semibold mb-6">Your Progress</h3>
      
      <div className="bg-[#22222C] rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 lg:gap-8 mb-6">
          <div className="flex-shrink-0 text-center sm:text-left">
            <div className="text-[#2A9E8B] text-5xl sm:text-6xl xl:text-7xl md:text-4xl font-bold leading-none mb-2">
              {percentage}%
            </div>
            <div className="text-white text-lg font-semibold">
              {completed}/{total} Video
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <CircularProgress percentage={percentage} size={100} strokeWidth={8} />
          </div>
        </div>
        
        <p className="text-white text-sm leading-relaxed">
          Progress belajar kamu luar biasa! Teruskan menonton modul untuk membuka level pengetahuan berikutnya.
        </p>
      </div>
    </div>
  )
}
