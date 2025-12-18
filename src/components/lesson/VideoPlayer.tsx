'use client'

import { useState } from 'react'

interface VideoPlayerProps {
  videoUrl?: string
  thumbnail: string
  title: string
  moduleNumber: string
}

export function VideoPlayer({ videoUrl, thumbnail, title, moduleNumber }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="space-y-6">
      <h2 className="text-[#2A9E8B] text-xl font-semibold">You're Watching</h2>
      
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        <video
          className="w-full h-full object-cover"
          poster={thumbnail}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          {videoUrl && <source src={videoUrl} type="video/mp4" />}
        </video>
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button 
              onClick={() => setIsPlaying(true)}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center group"
            >
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Video controls overlay - placeholder */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-[#2A9E8B] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </button>
            
            <span className="text-white text-sm">0:00</span>
            
            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white w-0" />
            </div>
            
            <span className="text-white text-sm">10:30 / 30:00</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">{moduleNumber}</p>
          <h1 className="text-white text-2xl font-bold mt-1">{title}</h1>
        </div>
        
        <p className="text-gray-400 text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </p>
        
        <div className="flex gap-6 border-b border-gray-700/30">
          <button className="pb-3 text-white font-medium border-b-2 border-white">
            Video Sebelumnya
          </button>
          <button className="pb-3 text-gray-500 hover:text-gray-300 transition-colors">
            Video Selanjutnya
          </button>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-4 p-4 bg-[#1a2332] rounded-lg hover:bg-[#1f2937] transition-colors cursor-pointer">
            <div className="flex-shrink-0 w-24 h-16 bg-[#0d1820] rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm mb-1">Lorem Ipsum Dolor Sit Amet</h4>
              <p className="text-gray-400 text-xs">15 Mins</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-[#1a2332] rounded-lg hover:bg-[#1f2937] transition-colors cursor-pointer">
            <div className="flex-shrink-0 w-24 h-16 bg-[#0d1820] rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm mb-1">Lorem Ipsum Dolor Sit Amet</h4>
              <p className="text-gray-400 text-xs">20 Mins</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
