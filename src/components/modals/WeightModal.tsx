import React from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../db'
import { useBaby } from '../../context/BabyContext'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { WeightLog } from '../../types'

interface WeightFormData { weightKg: number; recordedDate: string }

export function WeightModal({ open, onClose, editWeight }: {
  open: boolean; onClose: () => void; editWeight?: WeightLog | null
}) {
  const { activeBaby } = useBaby()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<WeightFormData>({
    defaultValues: {
      weightKg: editWeight?.weightKg,
      recordedDate: editWeight ? format(new Date(editWeight.recordedDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
    }
  })

  const onSubmit = async (data: WeightFormData) => {
    if (!activeBaby) return
    const log: WeightLog = {
      id: editWeight?.id ?? uuidv4(),
      babyId: activeBaby.id,
      weightKg: Number(data.weightKg),
      recordedDate: new Date(data.recordedDate).getTime(),
      createdAt: editWeight?.createdAt ?? Date.now()
    }
    await db.weightLogs.put(log)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editWeight ? 'Edit Weight' : 'Log Weight'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-display font-700 text-gray-600 mb-1 block uppercase tracking-wide">Weight (kg) *</label>
          <input type="number" step="0.01" {...register('weightKg', { required: true, min: 0.5, max: 30 })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-display font-700 text-center focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white/80"
            placeholder="6.5" />
          {errors.weightKg && <p className="text-red-400 text-xs mt-1">Please enter a valid weight</p>}
        </div>
        <div>
          <label className="text-xs font-display font-700 text-gray-600 mb-1 block uppercase tracking-wide">Date</label>
          <input type="date" {...register('recordedDate', { required: true })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-body text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white/80" />
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {editWeight ? 'Save Changes' : 'Log Weight'}
        </Button>
      </form>
    </Modal>
  )
}
