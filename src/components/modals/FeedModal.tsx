import React from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../db'
import { useBaby } from '../../context/BabyContext'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { FeedLog } from '../../types'

interface FeedFormData {
  quantityMl: number
  feedDate: string
  feedTime: string
}

interface Props {
  open: boolean
  onClose: () => void
  editFeed?: FeedLog | null
}

export function FeedModal({ open, onClose, editFeed }: Props) {
  const { activeBaby } = useBaby()
  const now = new Date()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<FeedFormData>({
    defaultValues: {
      quantityMl: editFeed?.quantityMl ?? undefined,
      feedDate: editFeed ? format(new Date(editFeed.feedTime), 'yyyy-MM-dd') : format(now, 'yyyy-MM-dd'),
      feedTime: editFeed ? format(new Date(editFeed.feedTime), 'HH:mm') : format(now, 'HH:mm'),
    }
  })

  const onSubmit = async (data: FeedFormData) => {
    if (!activeBaby) return
    const dt = new Date(`${data.feedDate}T${data.feedTime}`)
    const feed: FeedLog = {
      id: editFeed?.id ?? uuidv4(),
      babyId: activeBaby.id,
      quantityMl: Number(data.quantityMl),
      feedTime: dt.getTime(),
      createdAt: editFeed?.createdAt ?? Date.now()
    }
    await db.feedLogs.put(feed)
    reset()
    onClose()
  }

  const presets = [60, 90, 120, 150, 180]

  return (
    <Modal open={open} onClose={onClose} title={editFeed ? 'Edit Feed' : 'Log Feed'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-display font-700 text-gray-600 mb-1 block uppercase tracking-wide">Quantity (ml) *</label>
          <input
            type="number"
            {...register('quantityMl', { required: 'Required', min: { value: 1, message: 'Must be positive' }, max: { value: 500, message: 'Max 500ml' } })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-display font-700 text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white/80"
            placeholder="120"
          />
          {errors.quantityMl && <p className="text-red-400 text-xs mt-1">{errors.quantityMl.message}</p>}
        </div>

        <div className="flex gap-2 flex-wrap">
          {presets.map(p => (
            <button key={p} type="button" onClick={() => setValue('quantityMl', p)}
              className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 text-sm font-display font-700 border border-sky-200 hover:bg-sky-100 transition-colors">
              {p}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-display font-700 text-gray-600 mb-1 block uppercase tracking-wide">Date</label>
            <input type="date" {...register('feedDate', { required: true })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white/80" />
          </div>
          <div>
            <label className="text-xs font-display font-700 text-gray-600 mb-1 block uppercase tracking-wide">Time</label>
            <input type="time" {...register('feedTime', { required: true })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white/80" />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {editFeed ? 'Save Changes' : 'Log Feed'}
        </Button>
      </form>
    </Modal>
  )
}
