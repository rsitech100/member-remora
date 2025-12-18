export interface ILoginForm {
  phoneNumber: string
}

export interface IOTPForm {
  otp: string[]
}

export type TAuthStep = 'login' | 'otp' | 'expired'
