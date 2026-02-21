export interface ILoginForm {
  phoneNumber: string
}

export interface IOTPForm {
  otp: string[]
}

export type TAuthStep = 'login' | 'otp' | 'expired'
export type TLoginMethod = 'otp' | 'discord'
export * from './api'
