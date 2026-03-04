export type LoginMethod = 'otp' | 'discord'

export interface LoginMethodConfig {
  id: LoginMethod
  label: string
  description: string
  enabled: boolean
}

export const loginConfig: Record<LoginMethod, LoginMethodConfig> = {
  otp: {
    id: 'otp',
    label: 'Phone Number',
    description: 'Login with your phone number and OTP verification via WhatsApp',
    enabled:true,  
  },
  discord: {
    id: 'discord',
    label: 'Discord',
    description: 'Login with your Discord account',
    enabled: true,  
  },
}

export function getEnabledLoginMethods(): LoginMethodConfig[] {
  return Object.values(loginConfig).filter((m) => m.enabled)
}

export function getDefaultLoginMethod(): LoginMethod {
  const enabled = getEnabledLoginMethods()
  return enabled.length > 0 ? enabled[0].id : 'otp'
}

export function hasMultipleLoginMethods(): boolean {
  return getEnabledLoginMethods().length > 1
}
