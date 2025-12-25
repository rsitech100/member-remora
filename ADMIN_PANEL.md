# Admin Panel Implementation

## Overview
A professional admin panel has been created for course and video management. The admin panel automatically detects admin users and redirects them from the regular dashboard.

## Features

### Authentication Flow
- ✅ **Token-based authentication check** on login page
- ✅ **Automatic role detection** - Admin users are redirected to `/admin`
- ✅ **Protected routes** - Admin routes require authentication and admin role

### Admin Dashboard (`/admin`)
- **Course Management**
  - View all courses in a grid layout
  - Create new courses with image upload
  - Edit existing courses
  - Delete courses
  - Each course shows video count and thumbnail

### Course Video Management (`/admin/courses/:id`)
- **Video Management**
  - View all videos for a specific course
  - Add new videos with file upload
  - Edit video details
  - Delete videos
  - Track video status (active/inactive)
  - Track HLS conversion status (ready/processing/failed)
  - Set video order for playlist sequencing

## Routes

### Pages
- `/admin` - Main admin dashboard with course list
- `/admin/courses/:id` - Video management for specific course
- `(admin)` folder group with shared layout

### API Routes
All API routes use the local proxy pattern:

**Upload Endpoints:**
- `POST /api/admin/upload` - Upload course images
- `POST /api/admin/upload-video` - Upload video files

**Course Management:**
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course

**Video Management:**
- `POST /api/admin/videos` - Add video to course
- `DELETE /api/admin/videos/:id` - Delete video

## Components Structure

```
src/components/admin/
├── AdminLayoutView.tsx         # Main admin layout with header
├── AdminDashboardView.tsx      # Course list view with create button
├── CourseList.tsx              # Grid of course cards
├── CourseCard.tsx              # Individual course card with actions
├── CourseModal.tsx             # Create/Edit course modal with image upload
├── CourseVideoManagement.tsx   # Video management page
├── VideoList.tsx               # List of videos for a course
├── VideoCard.tsx               # Individual video card with actions
└── VideoModal.tsx              # Add/Edit video modal with file upload
```

## Design Theme

The admin panel follows the existing Remora design system:

- **Primary Color:** `#2A9E8B` (Teal green)
- **Background:** `#0a0a0a` (Dark)
- **Card Background:** `#1a1a1a`
- **Border Color:** `#gray-800`
- **Text:** White and gray scale
- **Hover Effects:** Smooth transitions on buttons and cards

## User Flow

### Login Flow
1. User enters phone number and OTP
2. On successful authentication, token is stored
3. System checks user role from `/api/dashboard`
4. If role is "admin", redirect to `/admin`
5. If role is not admin, show regular `/dashboard`

### Course Management Flow
1. Admin sees course grid on `/admin`
2. Click "Create Course" to open modal
3. Upload course image (sent to `/api/upload`)
4. Fill in title, subtitle, description
5. Submit to create course via `/api/courses`
6. Course appears in grid

### Video Management Flow
1. Click "Manage Videos" on a course card
2. Navigate to `/admin/courses/:id`
3. See course details and video list
4. Click "Add Video" to open modal
5. Select video file (sent to `/api/upload-original`)
6. System returns video URL
7. Fill in video details (title, subtitle, description, status, order)
8. Submit to create video via `/api/videos`
9. Video is saved with course_id and video URL

## Data Flow

### Course Creation
```
1. Upload Image → /api/admin/upload
   Response: { data: { file_url: "/files/xxx.jpg" } }

2. Create Course → /api/admin/courses (POST)
   Payload: { title, subtitle, description, image: "baseUrl + file_url" }
   → Backend: /api/courses (POST)
```

### Video Creation
```
1. Upload Video → /api/admin/upload-video
   Response: { data: { file_url: "/files/xxx.mp4" } }

2. Create Video → /api/admin/videos (POST)
   Payload: {
     course_id,
     title,
     subtitle,
     description,
     original_video: file_url,
     status,
     order
   }
   → Backend: /api/videos (POST)
```

## Styling Features

- **Responsive Grid:** Adapts from 1 to 3 columns
- **Hover Effects:** Cards highlight on hover with border color change
- **Loading States:** Skeleton screens during data fetch
- **Upload Progress:** Visual progress bar for video uploads
- **Status Badges:** Color-coded badges for video status
- **Empty States:** Helpful messages when no content exists
- **Confirmation Dialogs:** Prevents accidental deletions

## Security

- All admin routes require authentication token
- Server-side role verification on page load
- Protected API endpoints with token validation
- Middleware redirect for unauthenticated users

## Technologies Used

- **Next.js 14+** - App Router with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Server Components** - For authentication checks
- **Client Components** - For interactive UI
- **Local Proxy** - All API calls go through Next.js API routes

## Future Enhancements

Potential additions:
- Bulk video upload
- Video preview before upload
- Drag-and-drop video reordering
- Analytics dashboard
- User management
- Video conversion status tracking
- Search and filter courses
