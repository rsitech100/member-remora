export const appConfig = {
  adminAppUrl: process.env.NEXT_PUBLIC_ADMIN_APP_URL || '',
  memberAppUrl: process.env.NEXT_PUBLIC_MEMBER_APP_URL || '',
} as const

export function getClientAdminRedirectUrl(token: string): string {
  return '/admin'
}

export function getMemberLoginUrl(): string {
  if (!appConfig.memberAppUrl) return '/login'
  return `${appConfig.memberAppUrl}/api/logout`
}
