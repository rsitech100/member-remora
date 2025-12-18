'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExpandButton } from '@/components/button/ExpandButton'
import { cn } from '@/lib/utils'

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  videoUrl?: string
  thumbnail?: string
}

interface LessonItemProps {
  lesson: Lesson
}

export function LessonItem({ lesson }: LessonItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <span className="text-white text-left">{lesson.title}</span>
        <ExpandButton isExpanded={isExpanded} onClick={(e) => e.stopPropagation()} />
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 animate-slide-up">
          <div className="bg-[#1a2332] rounded-xl p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-full md:w-72 h-48 bg-[#0d1820] rounded-lg overflow-hidden relative">
              {lesson.thumbnail ? (
                <>
                  <Image
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0d6157] to-[#0a0e14]">
                  <div className="text-center">
                    <div className="text-white/60 text-sm mb-2">HENDKY</div>
                    <div className="text-white font-bold text-lg">BELAJAR CARA <span className="text-[#2A9E8B]">PROFIT</span></div>
                    <div className="text-white font-bold text-lg"><span className="text-[#2A9E8B]">MILIARAN</span> DI SAHAM</div>
                  </div>
                </div>
              )}
              <button className="absolute inset-0 w-full h-full flex items-center justify-center group">
                <div className="w-16 h-16 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-white text-xl font-semibold mb-3">Drop Your Content Here</h3>
                <p className="text-gray-400 leading-relaxed">{lesson.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                <span>{lesson.title}</span>
                <span>{lesson.duration}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
