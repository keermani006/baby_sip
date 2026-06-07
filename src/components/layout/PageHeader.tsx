import React from 'react'
import { useBaby } from '../../context/BabyContext'
import { calcAge } from '../../utils'
import { Baby } from 'lucide-react'

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  const { activeBaby, babies, setActiveBaby } = useBaby()

  return (
    <div className="px-4 pt-12 pb-4 sm:pt-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-display font-900 text-2xl text-gray-800">{title}</h1>
          {subtitle && <p className="text-sm font-body text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {activeBaby && (
            <button
              className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/80 rounded-xl px-3 py-1.5 shadow-sm hover:bg-white transition-colors"
              onClick={() => {
                const idx = babies.findIndex(b => b.id === activeBaby.id)
                setActiveBaby(babies[(idx + 1) % babies.length])
              }}
            >
              <Baby className="w-4 h-4 text-sky-500 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-display font-700 text-gray-700 leading-tight">{activeBaby.name}</p>
                <p className="text-[10px] font-body text-gray-400">{calcAge(activeBaby.birthDate)}</p>
              </div>
              {babies.length > 1 && <span className="text-gray-300 text-xs">›</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
