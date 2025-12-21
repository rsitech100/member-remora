'use client'

import { useRef, ReactNode } from 'react'
import { CarouselControls } from './CarouselControls'

interface CarouselWrapperProps {
  title: string
  children: ReactNode
}

export function CarouselWrapper({ title, children }: CarouselWrapperProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300
      const newScrollPosition = carouselRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
      carouselRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#2A9E8B] text-xl font-semibold">{title}</h2>
        <CarouselControls 
          onScrollLeft={() => scrollCarousel('left')}
          onScrollRight={() => scrollCarousel('right')}
        />
      </div>
      
      <div 
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide scroll-smooth"
      >
        {children}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
