import React, { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false)
    }, 4500)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, 5000)

    return () => {
      clearTimeout(fadeOutTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f0ff 50%, #f0fdf7 100%)'
      }}
    >
      <div className="flex flex-col items-center justify-center gap-8 px-4">
        {/* Logo/Icon */}
        <div className="relative animate-splash-scale" aria-hidden="true">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-white shadow-glass-lg">
            <svg
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Professional feeding bottle icon */}
              <path d="M8 2h8v3c0 1.5-1 2.5-2.5 2.5h-3C9 7.5 8 6.5 8 5V2Z" />
              <path d="M7 5h10" />
              <path d="M8 5v13c0 1.5 1 2 2 2h4c1 0 2-0.5 2-2V5" />
              <path d="M9 8h6" />
              <circle cx="12" cy="11" r="1.5" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-400 to-sky-500 opacity-20 blur-xl"></div>
        </div>

        {/* App Name */}
        <div className="text-center animate-splash-fade-in-delayed-1">
          <h1 className="text-4xl font-display font-800 text-gray-800 tracking-tight">BabySip</h1>
        </div>

        {/* Tagline */}
        <div className="animate-splash-fade-in-delayed-2">
          <p className="text-center text-gray-600 font-body text-sm leading-relaxed">
            Track every feed. Monitor every milestone.
          </p>
        </div>

        {/* Credit */}
        <div className="mt-6 animate-splash-fade-in-delayed-3 text-center">
          <p className="text-xs text-gray-500 font-body">
            Designed & Developed by
          </p>
          <p className="text-xs font-display font-700 text-gray-700 mt-0.5">
            Keermani Pamishetty
          </p>
        </div>
      </div>
    </div>
  )
}
