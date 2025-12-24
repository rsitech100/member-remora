'use client'

interface CarouselControlsProps {
  onScrollLeft: () => void
  onScrollRight: () => void
}

export function CarouselControls({ onScrollLeft, onScrollRight }: CarouselControlsProps) {
  return (
    <div className="flex gap-2">
      <button 
        onClick={onScrollLeft}
        className="p-2.5 rounded-lg bg-[#2C2C38] text-gray-400 hover:text-white hover:bg-[#3A3A48] transition-all"
        aria-label="Previous"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={onScrollRight}
        className="p-2.5 rounded-lg bg-[#2C2C38] text-white hover:bg-[#3A3A48] transition-all"
        aria-label="Next"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
