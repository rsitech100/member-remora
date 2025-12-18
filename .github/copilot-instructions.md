# GitHub Copilot Instructions - Next.js Professional App

## Core Principles

### 1. Server-First Architecture
- **ALWAYS prioritize Server Components** over Client Components
- Only use `"use client"` when absolutely necessary (interactivity, hooks, browser APIs)
- Fetch data on the server using `async/await` in Server Components
- Keep client-side JavaScript minimal for optimal performance

### 2. Project Structure

```
app/                          # Routes only - minimal logic
├── (routes)/                 # Route groups
├── api/                      # API routes
└── layout.tsx               # Root layout

src/
├── components/              # All reusable components
│   ├── ui/                 # Base UI components (Button, Input, etc.)
│   ├── forms/              # Form components
│   ├── layout/             # Layout components (Header, Footer, etc.)
│   └── shared/             # Shared business components
├── lib/                    # Utilities and helpers
│   ├── utils.ts           # General utilities
│   ├── api.ts             # API helpers
│   └── validations.ts     # Validation schemas
├── types/                  # TypeScript types/interfaces
├── hooks/                  # Custom React hooks (client-side only)
├── actions/               # Server Actions
└── constants/             # Constants and configurations
```

### 3. File Organization Rules

#### App Directory (`app/`)
- **Purpose**: Routing only
- Keep page files minimal - import and render components from `src/components`
- Example:
```tsx
// app/dashboard/page.tsx
import { DashboardView } from '@/components/dashboard/DashboardView'

export default function DashboardPage() {
  return <DashboardView />
}
```

#### Components Directory (`src/components/`)
- All business logic and UI components live here
- Follow atomic design principles: ui/ → shared/ → feature-specific

### 4. Reusable UI Components Standards

#### Button Component
```tsx
// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(/* variants */)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    )
  }
)
```

#### Input/Field Component
```tsx
// src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label>{label}</label>}
        <input ref={ref} className={className} {...props} />
        {error && <span className="text-red-500 text-sm">{error}</span>}
        {helperText && <span className="text-gray-500 text-sm">{helperText}</span>}
      </div>
    )
  }
)
```

### 5. Performance Optimization (Fastest Website)

#### Critical Performance Rules
1. **Image Optimization**
   - Always use `next/image` with proper `width`, `height`, and `sizes`
   - Use `priority` for above-the-fold images
   - Use `loading="lazy"` for below-the-fold images
   - Optimize image formats: WebP/AVIF

2. **Code Splitting**
   - Use dynamic imports for heavy components: `const Component = dynamic(() => import('@/components/Heavy'))`
   - Lazy load client components that aren't immediately needed
   - Split large pages into smaller chunks

3. **Font Optimization**
   - Use `next/font` for automatic font optimization
   - Prefer variable fonts
   - Subset fonts to needed characters

4. **Data Fetching**
   - Use Server Components for data fetching (no client-side fetch)
   - Implement proper caching strategies with `revalidate`
   - Use `fetch` with appropriate cache options
   - Implement parallel data fetching with `Promise.all()`

5. **Bundle Size**
   - Avoid large dependencies
   - Use tree-shakeable libraries
   - Check bundle size with `@next/bundle-analyzer`
   - Prefer native browser APIs over libraries when possible

6. **Streaming & Suspense**
   - Use `<Suspense>` for progressive rendering
   - Stream data with `loading.tsx` files
   - Show loading states immediately

7. **Metadata & SEO**
   - Always export `metadata` or `generateMetadata` in page files
   - Include proper Open Graph and Twitter cards
   - Use semantic HTML

#### Example: Optimized Page
```tsx
// app/products/page.tsx
import { Suspense } from 'react'
import { ProductList } from '@/components/products/ProductList'
import { ProductListSkeleton } from '@/components/products/ProductListSkeleton'

export const metadata = {
  title: 'Products | Your App',
  description: 'Browse our products',
}

// Fetch on server
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList products={products} />
    </Suspense>
  )
}
```

### 6. TypeScript Standards
- Use strict TypeScript configuration
- Define explicit types/interfaces in `src/types/`
- Avoid `any` - use `unknown` if type is truly unknown
- Export types for reusable components
- Use proper generic types for flexible components

### 7. Server Actions
```tsx
// src/actions/user.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function updateUser(formData: FormData) {
  const name = formData.get('name')
  
  // Validate input
  // Update database
  
  revalidatePath('/profile')
  return { success: true }
}
```

### 8. Error Handling
- Create `error.tsx` for error boundaries
- Use `not-found.tsx` for 404 handling
- Implement proper try-catch in Server Components
- Show user-friendly error messages

### 9. Styling Guidelines
- Use Tailwind CSS for utility-first styling
- Create `cn()` utility for className merging
- Define design tokens in `tailwind.config.ts`
- Use CSS variables for theming
- Avoid inline styles - prefer utility classes

### 10. Code Quality
- Follow ESLint rules strictly
- Use Prettier for consistent formatting
- Write self-documenting code with clear names
- Add JSDoc comments for complex functions
- Keep functions small and focused (single responsibility)

### 11. Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- Types/Interfaces: PascalCase with prefix (e.g., `IUser`, `TResponse`)
- Server Actions: camelCase with action suffix (e.g., `createUserAction`)

### 12. Security Best Practices
- Validate all inputs (server and client)
- Use environment variables for secrets
- Implement CSRF protection for forms
- Sanitize user-generated content
- Use proper authentication middleware

### 13. Accessibility (a11y)
- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Maintain proper color contrast
- Add alt text to all images

### 14. Testing Strategy
- Write unit tests for utilities and helpers
- Integration tests for Server Actions
- E2E tests for critical user flows
- Test components in isolation

## Quick Reference Checklist

Before creating any component, ask:
- [ ] Can this be a Server Component? (default: yes)
- [ ] Is it in the right directory? (app/ for routes, src/ for logic)
- [ ] Does it follow the reusable component pattern?
- [ ] Is it optimized for performance?
- [ ] Are types properly defined?
- [ ] Is it accessible?
- [ ] Does it have proper error handling?

## Common Patterns to Avoid

❌ **DON'T:**
- Put business logic in `app/` directory
- Use Client Components by default
- Fetch data on the client when it can be done on server
- Create one-off components instead of reusable ones
- Skip image optimization
- Ignore bundle size
- Use inline styles
- Skip TypeScript types

✅ **DO:**
- Keep `app/` minimal (routing only)
- Default to Server Components
- Fetch data on server
- Build reusable component library
- Optimize all images with next/image
- Monitor bundle size regularly
- Use Tailwind utilities
- Define strict types for everything

---

**Remember**: Server Components are faster, more secure, and reduce JavaScript bundle size. Always start with Server Components and only add `"use client"` when you need interactivity.
