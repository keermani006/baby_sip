import React, { useMemo } from 'react'
import { format, subMonths, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'
import { PageHeader } from '../components/layout/PageHeader'
import { GlassCard } from '../components/ui/GlassCard'
import { EmptyState } from '../components/ui/EmptyState'
import { useFeeds, useWeights } from '../hooks/useData'
import { useBaby } from '../context/BabyContext'
import { getMonthStats } from '../utils'
import { BarChart3 } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs font-body text-gray-500">{label}</p>
        <p className="font-display font-800 text-sky-600">{payload[0].value} ml</p>
      </div>
    )
  }
  return null
}

export function AnalyticsPage() {
  const feeds = useFeeds()
  const weights = useWeights()
  const { activeBaby } = useBaby()
  const now = new Date()

  // Current month daily data
  const dailyData = useMemo(() => {
    const days = eachDayOfInterval({ start: startOfMonth(now), end: now })
    return days.map(day => {
      const key = format(day, 'yyyy-MM-dd')
      const total = feeds.filter(f => format(new Date(f.feedTime), 'yyyy-MM-dd') === key).reduce((s, f) => s + f.quantityMl, 0)
      return { date: format(day, 'MMM d'), total, fullDate: key }
    })
  }, [feeds])

  // Monthly averages (last 6 months)
  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(now, 5 - i)
      const stats = getMonthStats(feeds, d.getFullYear(), d.getMonth() + 1)
      return { month: format(d, 'MMM'), avg: stats.avgDaily }
    })
  }, [feeds])

  // Weight data
  const weightData = useMemo(() => {
    return weights.map(w => ({
      date: format(new Date(w.recordedDate), 'MMM d'),
      weight: w.weightKg
    }))
  }, [weights])

  if (!activeBaby || feeds.length === 0) {
    return (
      <div>
        <PageHeader title="Analytics" />
        <EmptyState icon={<BarChart3 className="w-12 h-12" />} title="No data yet" subtitle="Log some feeds to see beautiful charts." />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Analytics" />
      <div className="px-4 space-y-4 pb-4">

        {/* Daily intake chart */}
        <GlassCard className="p-4">
          <h3 className="font-display font-800 text-gray-700 mb-1">Daily Intake</h3>
          <p className="text-xs font-body text-gray-400 mb-4">{format(now, 'MMMM yyyy')}</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={dailyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7eb8e8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7eb8e8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'DM Sans' }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fontFamily: 'DM Sans' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#4da3e0" strokeWidth={2} fill="url(#blueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Monthly average chart */}
        <GlassCard className="p-4">
          <h3 className="font-display font-800 text-gray-700 mb-1">Monthly Average</h3>
          <p className="text-xs font-body text-gray-400 mb-4">Last 6 months</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'DM Sans' }} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'DM Sans' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" fill="#7eb8e8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Growth chart */}
        {weights.length >= 2 && (
          <GlassCard className="p-4">
            <h3 className="font-display font-800 text-gray-700 mb-1">Weight Growth</h3>
            <p className="text-xs font-body text-gray-400 mb-4">Weight progression (kg)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weightData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'DM Sans' }} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'DM Sans' }} domain={['auto', 'auto']} />
                <Tooltip formatter={(v: number) => [`${v} kg`, 'Weight']} />
                <Line type="monotone" dataKey="weight" stroke="#34c78a" strokeWidth={2.5} dot={{ fill: '#34c78a', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
