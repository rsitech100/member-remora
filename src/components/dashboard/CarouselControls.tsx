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
        className="p-2 rounded-lg bg-[#1a2332] text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={onScrollRight}
        className="p-2 rounded-lg bg-[#1a2332] text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
