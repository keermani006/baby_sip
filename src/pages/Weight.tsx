import React, { useState } from 'react'
import { format } from 'date-fns'
import { PageHeader } from '../components/layout/PageHeader'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { WeightModal } from '../components/modals/WeightModal'
import { useWeights } from '../hooks/useData'
import { useBaby } from '../context/BabyContext'
import { db } from '../db'
import { Scale, Pencil, Trash2 } from 'lucide-react'
import type { WeightLog } from '../types'

export function WeightPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editWeight, setEditWeight] = useState<WeightLog | null>(null)
  const weights = useWeights()
  const { activeBaby } = useBaby()

  const deleteWeight = async (id: string) => {
    if (!confirm('Delete this weight record?')) return
    await db.weightLogs.delete(id)
  }

  const sortedWeights = [...weights].sort((a, b) => b.recordedDate - a.recordedDate)

  const latestWeight = sortedWeights[0]
  const prevWeight = sortedWeights[1]
  const weightDiff = latestWeight && prevWeight
    ? (latestWeight.weightKg - prevWeight.weightKg).toFixed(2)
    : null

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Weight"
        action={
          <Button size="sm" onClick={() => { setEditWeight(null); setModalOpen(true) }}>
            + Log
          </Button>
        }
      />

      <div className="px-4 space-y-4 pb-4">
        {latestWeight && (
          <GlassCard className="p-5 bg-gradient-to-br from-mint-100 to-sky-50">
            <p className="text-xs font-display font-700 text-gray-500 uppercase tracking-wide">Current Weight</p>
            <div className="flex items-end gap-3 mt-1">
              <p className="text-5xl font-display font-900 text-gray-800">{latestWeight.weightKg}</p>
              <p className="text-2xl font-display font-600 text-gray-400 mb-1">kg</p>
              {weightDiff !== null && (
                <p className={`text-sm font-display font-700 mb-1 ${Number(weightDiff) >= 0 ? 'text-mint-500' : 'text-red-400'}`}>
                  {Number(weightDiff) >= 0 ? '+' : ''}{weightDiff} kg
                </p>
              )}
            </div>
            <p className="text-xs font-body text-gray-400 mt-1">
              Recorded {format(new Date(latestWeight.recordedDate), 'MMMM d, yyyy')}
            </p>
          </GlassCard>
        )}

        {sortedWeights.length === 0 ? (
          <EmptyState
            icon={<Scale className="w-12 h-12" />}
            title="No weight history"
            subtitle="Track your baby's weight to monitor growth."
            action={
              <Button onClick={() => setModalOpen(true)}>Log First Weight</Button>
            }
          />
        ) : (
          <div>
            <h2 className="font-display font-800 text-gray-700 mb-2 text-sm uppercase tracking-wide">Weight Timeline</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-200 to-transparent" />
              <div className="space-y-3">
                {sortedWeights.map((w, i) => (
                  <div key={w.id} className="flex items-start gap-4">
                    <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-sky-200 to-sky-300 flex items-center justify-center font-display font-800 text-sky-700 text-sm shrink-0">
                      {w.weightKg}
                    </div>
                    <GlassCard className="flex-1 p-3 flex items-center justify-between">
                      <div>
                        <p className="font-display font-700 text-gray-700">{w.weightKg} kg</p>
                        <p className="text-xs font-body text-gray-400">{format(new Date(w.recordedDate), 'MMMM d, yyyy')}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditWeight(w); setModalOpen(true) }}
                          className="w-7 h-7 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition-colors"
                          title="Edit weight"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteWeight(w.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                          title="Delete weight"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <WeightModal open={modalOpen} onClose={() => { setModalOpen(false); setEditWeight(null) }} editWeight={editWeight} />
    </div>
  )
}
