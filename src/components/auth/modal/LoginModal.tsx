'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { LoginForm } from '../forms/LoginForm'
import { DiscordLoginForm } from '../forms/DiscordLoginForm'
import { RemoraLogo } from '@/components/ui/Icon'
import {
  loginConfig,
  getDefaultLoginMethod,
  hasMultipleLoginMethods,
  getEnabledLoginMethods,
  type LoginMethod,
} from '@/lib/login'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (phoneNumber: string) => void
  onExpired: () => void
  onDiscordSuccess: () => void
}

export function LoginModal({ isOpen, onClose, onSuccess, onExpired, onDiscordSuccess }: LoginModalProps) {
  const [activeMethod, setActiveMethod] = useState<LoginMethod>(getDefaultLoginMethod())
  const [discordError, setDiscordError] = useState('')
  const showSwitcher = hasMultipleLoginMethods()
  const enabledMethods = getEnabledLoginMethods()

  const renderLoginContent = () => {
    if (activeMethod === 'discord' && loginConfig.discord.enabled) {
      return (
        <div className="flex flex-col gap-4">
          <DiscordLoginForm
            onSuccess={onDiscordSuccess}
            onError={(error) => setDiscordError(error)}
          />
          {discordError && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-fade-in">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 4V8M8 11V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{discordError}</span>
            </div>
          )}
        </div>
      )
    }

    return <LoginForm onSuccess={onSuccess} onExpired={onExpired} />
  }

  const renderMethodSwitcher = () => {
    if (!showSwitcher) return null

    return (
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700/50" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-gray-700/50" />
        </div>

        {enabledMethods
          .filter((m) => m.id !== activeMethod)
          .map((method) => (
            <button
              key={method.id}
              onClick={() => {
                setActiveMethod(method.id)
                setDiscordError('')
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-700/50 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {method.id === 'discord' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.8732.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                </svg>
              )}
              {method.id === 'otp' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              )}
              <span>Continue with {method.label}</span>
            </button>
          ))}
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="md:hidden flex flex-col bg-[#0a0e14]">
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src="/images/login.png"
            alt="Trading Chart"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d4b42]/60 to-transparent" />
          <div className="absolute top-3 left-3 rounded-md p-3 bg-[#0a0e14] z-10 ">
            <RemoraLogo className="z-12" width={30} height={30} />
          </div>
        </div>

        <div className="flex-1 px-6 pb-8 relative mt-12 z-10 mb-12 flex flex-col">
          <h1 className="text-4xl font-semibold text-[#2A9E8B] text-center mb-8">
            Mulai Perjalanan<br />Tradingmu
          </h1>

          <div className="mt-auto flex flex-col gap-4">
            {renderLoginContent()}
            {renderMethodSwitcher()}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex md:grid md:grid-cols-2 gap-0">
        <div className="relative w-full h-48 md:h-full md:min-h-[500px] md:order-2 rounded-t-2xl md:rounded-t-none md:rounded-r-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Image
            src="/images/login.png"
            alt="Login"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d4b42]/60 to-transparent" />
        </div>
        <div className="p-8 md:p-12 md:order-1 animate-slide-right relative">
          <RemoraLogo className="absolute top-8 left-8 md:top-12 md:left-12 animate-fade-in" width={50} height={50} />
          
          <div className="flex flex-col h-full pt-20 md:pt-22">
            <h1 className="text-3xl md:text-5xl text-[#2A9E8B] animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Mulai Perjalanan<br />Tradingmu
            </h1>

            <div className="mt-auto flex flex-col gap-6">
              {renderLoginContent()}
              {renderMethodSwitcher()}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
