import { RemoraLogo } from '@/components/ui/Icon'

export function PromoCard() {
  return (
    <div className="bg-gradient-to-br from-[#1a2332] to-[#0d1820] rounded-2xl p-6 border border-[#2A9E8B]/20">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <RemoraLogo width={60} height={60} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-2">
            Belajar langsung dari trader berpengalaman!
          </h3>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            Libat strategi real-time, analisis pasar, dan ambil peluang trading terbaik hari ini.
          </p>
          
          <a 
            href="https://remoratrader.id"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#2A9E8B] hover:bg-[#248276] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className='text-xs'>Daftar Live Trading Remora</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
