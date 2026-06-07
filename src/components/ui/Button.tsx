import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'font-display font-700 rounded-xl transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2'
  const variants = {
    primary: 'bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow-md hover:from-sky-500 hover:to-sky-600',
    secondary: 'bg-white/80 text-sky-600 border border-sky-200 hover:bg-sky-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base'
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  )
}

export function FAB({ onClick, icon = '+' }: { onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-600 text-white rounded-full shadow-glass-lg flex items-center justify-center active:scale-95 transition-all hover:shadow-xl animate-bounce-soft"
      aria-label="Add feed"
    >
      {typeof icon === 'string' ? <span className="text-2xl font-display font-800">{icon}</span> : icon}
    </button>
  )
}
