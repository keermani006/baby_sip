import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  animate?: boolean
}

export function GlassCard({ children, className = '', onClick, animate = true }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/70 backdrop-blur-md border border-white/80
        rounded-2xl shadow-card
        ${animate ? 'animate-fade-in' : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, icon, color = 'blue' }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; color?: string
}) {
  const colors: Record<string, string> = {
    blue: 'from-sky-300 to-sky-400',
    mint: 'from-mint-300 to-mint-500',
    blush: 'from-blush-300 to-blush-500',
    purple: 'from-purple-300 to-purple-500',
  }
  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-body text-gray-500 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-display font-800 text-gray-800 mt-1 leading-tight">{value}</p>
          {sub && <p className="text-xs font-body text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color] || colors.blue} flex items-center justify-center shadow-sm text-white`}>
          {icon}
        </div>
      </div>
    </GlassCard>
  )
}
