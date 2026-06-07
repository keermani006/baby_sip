import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { Baby as BabyIcon, Pencil, Trash2 } from 'lucide-react'
import { db } from '../../db'
import { useBaby } from '../../context/BabyContext'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/GlassCard'
import { calcAge } from '../../utils'
import type { Baby } from '../../types'

interface BabyFormData { name: string; birthDate: string; gender: 'male' | 'female' | 'other' }

export function BabyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { babies, activeBaby, setActiveBaby, refreshBabies } = useBaby()
  const [editingBaby, setEditingBaby] = useState<Baby | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BabyFormData>({
    defaultValues: editingBaby ? { name: editingBaby.name, birthDate: editingBaby.birthDate, gender: editingBaby.gender } : {}
  })

  const onSubmit = async (data: BabyFormData) => {
    const baby: Baby = {
      id: editingBaby?.id ?? uuidv4(),
      name: data.name,
      birthDate: data.birthDate,
      gender: data.gender,
      createdAt: editingBaby?.createdAt ?? Date.now()
    }
    await db.babies.put(baby)
    await refreshBabies()
    if (!editingBaby) setActiveBaby(baby)
    reset()
    setShowForm(false)
    setEditingBaby(null)
  }

  const deleteBaby = async (baby: Baby) => {
    if (!confirm(`Delete ${baby.name} and all their data?`)) return
    await db.babies.delete(baby.id)
    await db.feedLogs.where('babyId').equals(baby.id).delete()
    await db.weightLogs.where('babyId').equals(baby.id).delete()
    await refreshBabies()
    if (activeBaby?.id === baby.id) setActiveBaby(null)
  }

  return (
    <Modal open={open} onClose={onClose} title="Manage Babies">
      <div className="space-y-3">
        {babies.map(baby => (
          <GlassCard key={baby.id} className={`p-3 ${activeBaby?.id === baby.id ? 'ring-2 ring-sky-300' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                <BabyIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 cursor-pointer" onClick={() => { setActiveBaby(baby); onClose() }}>
                <p className="font-display font-700 text-gray-800">{baby.name}</p>
                <p className="text-xs font-body text-gray-400">{calcAge(baby.birthDate)} old</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditingBaby(baby); setShowForm(true) }}
                  className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition-colors"
                  title="Edit baby"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteBaby(baby)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                  title="Delete baby"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}

        {showForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="font-display font-700 text-gray-700 text-sm">{editingBaby ? 'Edit Baby' : 'Add Baby'}</h3>
            <input type="text" placeholder="Baby's name" {...register('name', { required: true })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-body text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white/80" />
            <input type="date" {...register('birthDate', { required: true })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-body text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white/80" />
            <select {...register('gender')} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-body text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white/80">
              <option value="male">Boy</option>
              <option value="female">Girl</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-2">
              <Button type="submit" size="md" className="flex-1" loading={isSubmitting}>Save</Button>
              <Button type="button" variant="secondary" size="md" onClick={() => { setShowForm(false); setEditingBaby(null); reset() }}>Cancel</Button>
            </div>
          </form>
        ) : (
          <Button variant="secondary" size="md" className="w-full" onClick={() => setShowForm(true)}>
            + Add Baby
          </Button>
        )}
      </div>
    </Modal>
  )
}
