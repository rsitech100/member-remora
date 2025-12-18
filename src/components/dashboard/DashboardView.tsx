'use client'

import { CourseCard } from '../cards/CourseCard'
import { ProgressCard } from '../cards/ProgressCard'
import { LastVideoCard } from '../cards/LastVideoCard'
import { LessonCardSmall } from '../cards/LessonCardSmall'
import { PromoCard } from '../cards/PromoCard'

const courses = [
  {
    id: '1',
    title: 'Welcome To The Course!',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    thumbnail: '/images/course-1.jpg',
    duration: '5 Min',
    instructor: 'Introduction',
    completed: true,
  },
  {
    id: '2',
    title: 'Lorem Ipsum Dolor Sit Amet',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    thumbnail: '/images/course-2.jpg',
    duration: '21 Min',
    instructor: 'Module 1',
    completed: true,
  },
  {
    id: '3',
    title: 'Consectetur Adipiscing Et Ullm',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    thumbnail: '/images/course-3.jpg',
    duration: '14 Min',
    instructor: 'Module 2',
    completed: false,
  },
]

export function DashboardView() {
  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden px-4 py-6 space-y-6">
        <LastVideoCard
          title="Learning how to basic trading in 30 minutes"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
          instructor="Hengky Adinata"
          instructorRole="Trading Mentor"
          thumbnail="/images/last-video.jpg"
          duration="01:08:00 Hrs"
          totalLessons="27/30 Total Module"
          language="Indonesia"
        />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#2A9E8B] text-xl font-semibold">All Lessons</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-[#1a2332] text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 rounded-lg bg-[#1a2332] text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {courses.map((course) => (
              <LessonCardSmall key={course.id} {...course} />
            ))}
          </div>
        </div>

        <ProgressCard percentage={20} completed={3} total={10} isMobile={true} />
        
        <PromoCard />
      </div>

      <div className="hidden lg:block container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-[#2A9E8B] text-xl font-semibold mb-4">Semua Modul</h2>
            </div>
            
            <div className="space-y-4">
              {courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ProgressCard percentage={75} completed={2} total={3} />
            </div>
          </div>
        </div>
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
    </>
  )
}
