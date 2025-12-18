'use client'

import { useEffect, useState } from 'react'

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
}

export function CircularProgress({ percentage, size = 140, strokeWidth = 12 }: CircularProgressProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])
  
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const arcLength = circumference * 0.75
  const offset = arcLength - (animatedPercentage / 100) * arcLength
  
  const needleAngle = (animatedPercentage / 100) * 270 + 135
  const needleLength = radius - 5
  const needleX = size / 2 + needleLength * Math.cos((needleAngle * Math.PI) / 180)
  const needleY = size / 2 + needleLength * Math.sin((needleAngle * Math.PI) / 180)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3a3a44"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          className="transform rotate-[135deg] origin-center"
          style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2A9E8B"
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transform rotate-[135deg] origin-center transition-all duration-1000 ease-out"
          style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
        />
        
        <line
          x1={size / 2}
          y1={size / 2}
          x2={needleX}
          y2={needleY}
          stroke="#2A9E8B"
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r="4"
          fill="#2A9E8B"
        />
      </svg>
    </div>
  )
}
