import React, { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false)
    }, 1800)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, 2400)

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
      <div className="flex flex-col items-center justify-center gap-6 px-4">
        {/* Logo/Icon */}
        <div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-white shadow-glass-lg animate-splash-scale"
          aria-hidden="true"
        >
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2c-6 0-8 3-8 8s2 8 8 8 8-3 8-8-2-8-8-8Z" />
            <path d="M12 6v8M8 10h8" />
          </svg>
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
