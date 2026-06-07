import React, { useState } from 'react'
import { format } from 'date-fns'
import { PageHeader } from '../components/layout/PageHeader'
import { GlassCard, StatCard } from '../components/ui/GlassCard'
import { FAB } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { FeedModal } from '../components/modals/FeedModal'
import { BabyModal } from '../components/modals/BabyModal'
import { useFeeds } from '../hooks/useData'
import { useBaby } from '../context/BabyContext'
import { getTodayStats, getWeekTotal, getMonthStats, generateInsights, formatMl, formatTime } from '../utils'
import { useWeights } from '../hooks/useData'
import {
  Baby,
  Droplet,
  Calendar,
  Activity,
  Award,
  Milk,
  TrendingUp,
  TrendingDown,
  Scale,
  Plus
} from 'lucide-react'

export function DashboardPage() {
  const [feedModalOpen, setFeedModalOpen] = useState(false)
  const [babyModalOpen, setBabyModalOpen] = useState(false)
  const feeds = useFeeds()
  const weights = useWeights()
  const { activeBaby } = useBaby()

  const today = getTodayStats(feeds)
  const weekTotal = getWeekTotal(feeds)
  const now = new Date()
  const monthStats = getMonthStats(feeds, now.getFullYear(), now.getMonth() + 1)
  const insights = generateInsights(feeds, weights)

  if (!activeBaby) {
    return (
      <div className="px-4 pt-12 pb-28 sm:pb-8 flex flex-col justify-center min-h-[75vh]">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="font-display font-900 text-2xl text-gray-800 flex-1">BabySip</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<Baby className="w-12 h-12" />}
            title="Welcome to BabySip"
            subtitle="Add your first baby to get started tracking feeds."
            action={
              <div className="mt-4 flex items-center justify-center w-full px-4 safe-area-pb">
                <button onClick={() => setBabyModalOpen(true)}
                  className="px-8 py-3.5 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-xl font-display font-700 shadow-md hover:from-sky-500 hover:to-sky-600 transition-all active:scale-[0.98] w-full sm:w-auto">
                  Add Baby
                </button>
              </div>
            }
          />
        </div>
        <BabyModal open={babyModalOpen} onClose={() => setBabyModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle={format(new Date(), 'EEEE, MMMM d')}
        action={
          <button onClick={() => setBabyModalOpen(true)}
            className="w-8 h-8 rounded-xl bg-white/70 border border-white/80 text-gray-500 flex items-center justify-center hover:bg-white shadow-sm transition-colors"
            title="Manage babies"
          >
            <Baby className="w-4 h-4 text-sky-500" />
          </button>
        }
      />

      <div className="px-4 space-y-4">
        {/* Hero today card */}
        <GlassCard className="p-5 bg-gradient-to-br from-sky-400 to-sky-600 border-0 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sky-100 text-xs font-display font-700 uppercase tracking-wide">Today's Total</p>
              <p className="text-5xl font-display font-900 mt-1 leading-tight">{today.total}</p>
              <p className="text-sky-200 text-sm font-body">ml · {today.count} feeds</p>
            </div>
            <div className="text-right">
              {today.lastFeed ? (
                <>
                  <p className="text-sky-100 text-xs font-display font-700 uppercase tracking-wide">Last Feed</p>
                  <p className="text-xl font-display font-800 mt-1">{today.lastFeed.quantityMl} ml</p>
                  <p className="text-sky-200 text-sm font-body">{formatTime(today.lastFeed.feedTime)}</p>
                </>
              ) : (
                <div className="text-sky-200 mt-2 flex justify-end">
                  <Droplet className="w-8 h-8 text-sky-200" />
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-xl h-2 overflow-hidden">
            <div className="bg-white rounded-xl h-2 transition-all duration-700"
              style={{ width: `${Math.min(100, (today.total / 900) * 100)}%` }} />
          </div>
          <p className="text-sky-100 text-xs mt-1 font-body">~900 ml daily goal</p>
        </GlassCard>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Weekly Total" value={formatMl(weekTotal)} icon={<Calendar className="w-5 h-5 text-white" />} color="blue" />
          <StatCard label="Month Avg" value={`${monthStats.avgDaily} ml`} sub="per day" icon={<Activity className="w-5 h-5 text-white" />} color="mint" />
          <StatCard label="Month High" value={`${monthStats.highest} ml`} sub="best day" icon={<Award className="w-5 h-5 text-white" />} color="purple" />
          <StatCard label="Feed Count" value={`${monthStats.feedCount}`} sub="this month" icon={<Milk className="w-5 h-5 text-white" />} color="blush" />
        </div>

        {/* Insights */}
        <div>
          <h2 className="font-display font-800 text-gray-700 mb-2 text-sm uppercase tracking-wide">Insights</h2>
          <div className="space-y-2">
            {insights.map(insight => {
              const IconComponent = {
                'trending-up': TrendingUp,
                'trending-down': TrendingDown,
                'award': Award,
                'scale': Scale,
                'droplet': Droplet
              }[insight.icon] || Droplet;
              return (
                <GlassCard key={insight.id} className="p-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500 shrink-0 mt-0.5">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-body text-gray-600 leading-relaxed flex-1">{insight.text}</p>
                </GlassCard>
              )
            })}
          </div>
        </div>

        {/* Recent feeds */}
        {feeds.length > 0 && (
          <div>
            <h2 className="font-display font-800 text-gray-700 mb-2 text-sm uppercase tracking-wide">Recent Feeds</h2>
            <GlassCard className="divide-y divide-gray-100">
              {feeds.slice(-5).reverse().map(feed => (
                <div key={feed.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500 shrink-0">
                      <Milk className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-display font-700 text-gray-700">{feed.quantityMl} ml</p>
                      <p className="text-xs font-body text-gray-400">{format(new Date(feed.feedTime), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </GlassCard>
          </div>
        )}
      </div>

      <FAB onClick={() => setFeedModalOpen(true)} icon={<Plus className="w-6 h-6" />} />
      <FeedModal open={feedModalOpen} onClose={() => setFeedModalOpen(false)} />
      <BabyModal open={babyModalOpen} onClose={() => setBabyModalOpen(false)} />
    </div>
  )
}
