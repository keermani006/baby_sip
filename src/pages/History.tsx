import React, { useState, useMemo } from 'react'
import { format, startOfMonth, getMonth, getYear } from 'date-fns'
import { PageHeader } from '../components/layout/PageHeader'
import { GlassCard } from '../components/ui/GlassCard'
import { Button, FAB } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { FeedModal } from '../components/modals/FeedModal'
import { useFeeds } from '../hooks/useData'
import { useBaby } from '../context/BabyContext'
import { groupFeedsByDay, getMonthStats } from '../utils'
import { db } from '../db'
import {
  ClipboardList,
  ChevronUp,
  ChevronDown,
  Milk,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react'
import type { FeedLog } from '../types'

export function HistoryPage() {
  const [feedModalOpen, setFeedModalOpen] = useState(false)
  const [editFeed, setEditFeed] = useState<FeedLog | null>(null)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const feeds = useFeeds()
  const { activeBaby } = useBaby()

  const now = new Date()
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth() + 1}`

  // Get unique months
  const monthKeys = useMemo(() => {
    const keys = new Set<string>()
    feeds.forEach(f => {
      const d = new Date(f.feedTime)
      keys.add(`${d.getFullYear()}-${d.getMonth() + 1}`)
    })
    return Array.from(keys).sort().reverse()
  }, [feeds])

  const deleteFeed = async (id: string) => {
    if (!confirm('Delete this feed?')) return
    await db.feedLogs.delete(id)
  }

  if (!activeBaby || feeds.length === 0) {
    return (
      <div>
        <PageHeader title="History" />
        <EmptyState icon={<ClipboardList className="w-12 h-12" />} title="No feeds recorded yet" subtitle="Start logging feeds to see your history here." />
        <FAB onClick={() => setFeedModalOpen(true)} icon={<Plus className="w-6 h-6" />} />
        <FeedModal open={feedModalOpen} onClose={() => setFeedModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="History" />
      <div className="px-4 space-y-4 pb-4">
        {monthKeys.map(monthKey => {
          const [year, month] = monthKey.split('-').map(Number)
          const stats = getMonthStats(feeds, year, month)
          const isCurrent = monthKey === currentMonthKey

          if (isCurrent) {
            // Detailed current month
            const grouped = groupFeedsByDay(feeds.filter(f => {
              const d = new Date(f.feedTime)
              return d.getFullYear() === year && d.getMonth() + 1 === month
            }))
            return (
              <div key={monthKey}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display font-800 text-gray-700">{stats.label}</h2>
                  <span className="text-xs font-body text-gray-400 bg-sky-50 px-2 py-0.5 rounded-full">Current month</span>
                </div>
                <div className="space-y-3">
                  {grouped.map(day => (
                    <GlassCard key={day.date}>
                      <button
                        className="w-full flex items-center justify-between p-4"
                        onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
                      >
                        <div className="text-left">
                          <p className="font-display font-700 text-gray-800">{format(new Date(day.date), 'EEEE, MMMM d')}</p>
                          <p className="text-xs font-body text-gray-400">{day.count} feeds</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-display font-800 text-sky-500 text-lg">{day.total} ml</p>
                          <div className="text-gray-300">
                            {expandedDay === day.date ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </button>
                      {expandedDay === day.date && (
                        <div className="px-4 pb-3 border-t border-gray-100 space-y-2 pt-3">
                          {day.feeds.map(feed => (
                            <div key={feed.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Milk className="w-4 h-4 text-sky-500 shrink-0" />
                                <div>
                                  <p className="text-sm font-display font-700 text-gray-700">{feed.quantityMl} ml</p>
                                  <p className="text-xs font-body text-gray-400">{format(new Date(feed.feedTime), 'h:mm a')}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => { setEditFeed(feed); setFeedModalOpen(true) }}
                                  className="w-7 h-7 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition-colors"
                                  title="Edit feed"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => deleteFeed(feed.id)}
                                  className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                                  title="Delete feed"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              </div>
            )
          }

          // Summary card for past months
          return (
            <GlassCard key={monthKey} className="p-4">
              <h3 className="font-display font-800 text-gray-800 mb-3">{stats.label}</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Avg Daily', value: `${stats.avgDaily} ml` },
                  { label: 'Highest Day', value: `${stats.highest} ml` },
                  { label: 'Lowest Day', value: `${stats.lowest} ml` },
                  { label: 'Total', value: `${(stats.total / 1000).toFixed(1)} L` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-sky-50/60 rounded-xl p-2.5">
                    <p className="text-xs font-body text-gray-400">{label}</p>
                    <p className="font-display font-800 text-gray-700 text-sm mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs font-body text-gray-400 mt-2 text-right">{stats.feedCount} total feeds</p>
            </GlassCard>
          )
        })}
      </div>

      <FAB onClick={() => { setEditFeed(null); setFeedModalOpen(true) }} icon={<Plus className="w-6 h-6" />} />
      <FeedModal open={feedModalOpen} onClose={() => { setFeedModalOpen(false); setEditFeed(null) }} editFeed={editFeed} />
    </div>
  )
}
