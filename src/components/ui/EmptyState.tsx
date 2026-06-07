import React from 'react'

export function EmptyState({ icon, title, subtitle, action }: {
  icon: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="mb-4 text-gray-300 flex items-center justify-center">{icon}</div>
      <h3 className="font-display font-700 text-lg text-gray-700 mb-1">{title}</h3>
      {subtitle && <p className="text-sm font-body text-gray-400 mb-4">{subtitle}</p>}
      {action}
    </div>
  )
}
