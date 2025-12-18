import { CircularProgress } from '@/components/ui/CircularProgress'

interface ProgressCardProps {
  percentage: number
  completed: number
  total: number
  isMobile?: boolean
}

export function ProgressCard({ percentage, completed, total, isMobile = false }: ProgressCardProps) {
  return (
    <div className="bg-[#1a2332] rounded-2xl p-6 shadow-xl border border-white/5">
      <h3 className="text-[#2A9E8B] text-lg font-semibold mb-6">Your Progress</h3>
      
      <div className={`${isMobile ? 'flex items-center gap-6' : 'flex flex-col items-center'}`}>
        <div className={isMobile ? 'flex-shrink-0' : 'mb-6'}>
          <CircularProgress percentage={percentage} size={isMobile ? 120 : 160} strokeWidth={14} />
        </div>
        
        <div className={isMobile ? 'flex-1' : 'text-center w-full'}>
          <div className={`text-white text-lg font-semibold ${isMobile ? 'mb-2' : 'mb-1'}`}>
            {completed}/{total} Module
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed">
            Progress belajar kamu luar biasa! Teruskan menonton modul untuk membuka level pengetahuan berikutnya.
          </p>
        </div>
      </div>
    </div>
  )
}
