export interface IUser {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
  role: string
  expires_at: string
}

export interface IVideo {
  id: number
  course_id: number
  title: string
  subtitle?: string
  description?: string
  original_video: string
  status: 'active' | 'inactive'
  order: number
  is_completed?: boolean
}

export interface ILastWatchedVideo {
  video_id: number
  title: string
  completed_at: string
  original_video: string
}

export interface ICourse {
  id: number
  title: string
  subtitle: string
  description: string
  image?: string
  videos: IVideo[]
}

export interface IDashboardCourse {
  course_id: number
  title: string
  description: string
  subtitle: string
  progress: string
  completed_videos: number
  total_videos: number
  last_watched_video: ILastWatchedVideo | null
  status: 'in_progress' | 'completed' | 'not_started'
}

export interface IAPIResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface IVerifyResponse {
  token: string
}

export interface IDashboardData {
  user: IUser
  courses: IDashboardCourse[]
  total_courses: number
}

export interface ICourseDetailData {
  course: {
    id: number
    title: string
    subtitle: string
    description: string
    image: string
  }
  videos: IVideo[]
}

export interface IWatchVideoData {
  title: string
  video_url: string
  description?: string
}

export interface IWatchHLSData {
  video_id: number
  title: string
  token: string
  playlist_url: string
  description?: string
}
