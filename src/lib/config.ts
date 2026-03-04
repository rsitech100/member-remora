export const appConfig = {
  adminAppUrl: process.env.NEXT_PUBLIC_ADMIN_APP_URL || '',
  memberAppUrl: process.env.NEXT_PUBLIC_MEMBER_APP_URL || '',
} as const

export function getClientAdminRedirectUrl(token: string): string {
  if (!appConfig.adminAppUrl) return '/admin'
  return `${appConfig.adminAppUrl}/api/auth/set-token-redirect?token=${encodeURIComponent(token)}&redirect=/admin`
}
