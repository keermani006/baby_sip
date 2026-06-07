import { format, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, differenceInMonths, differenceInDays } from 'date-fns'
import type { FeedLog, WeightLog, DayStats, MonthStats, Insight } from '../types'

export function calcAge(birthDate: string): string {
  const birth = new Date(birthDate)
  const now = new Date()
  const months = differenceInMonths(now, birth)
  if (months < 1) {
    const days = differenceInDays(now, birth)
    return `${days}d`
  }
  if (months < 12) return `${months}m`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years}y ${rem}m` : `${years}y`
}

export function groupFeedsByDay(feeds: FeedLog[]): DayStats[] {
  const map = new Map<string, FeedLog[]>()
  for (const f of feeds) {
    const key = format(new Date(f.feedTime), 'yyyy-MM-dd')
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(f)
  }
  return Array.from(map.entries())
    .map(([date, dayFeeds]) => ({
      date,
      total: dayFeeds.reduce((s, f) => s + f.quantityMl, 0),
      count: dayFeeds.length,
      feeds: dayFeeds.sort((a, b) => a.feedTime - b.feedTime)
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getMonthStats(feeds: FeedLog[], year: number, month: number): MonthStats {
  const start = startOfMonth(new Date(year, month - 1))
  const end = endOfMonth(start)
  const monthFeeds = feeds.filter(f => {
    const d = new Date(f.feedTime)
    return d >= start && d <= end
  })
  const days = eachDayOfInterval({ start, end }).map(day => {
    const key = format(day, 'yyyy-MM-dd')
    const dayFeeds = monthFeeds.filter(f => format(new Date(f.feedTime), 'yyyy-MM-dd') === key)
    return {
      date: key,
      total: dayFeeds.reduce((s, f) => s + f.quantityMl, 0),
      count: dayFeeds.length,
      feeds: dayFeeds.sort((a, b) => a.feedTime - b.feedTime)
    }
  })
  const activeDays = days.filter(d => d.total > 0)
  const totals = activeDays.map(d => d.total)
  return {
    year, month,
    label: format(start, 'MMMM yyyy'),
    avgDaily: totals.length ? Math.round(totals.reduce((s, v) => s + v, 0) / totals.length) : 0,
    highest: totals.length ? Math.max(...totals) : 0,
    lowest: totals.length ? Math.min(...totals) : 0,
    total: totals.reduce((s, v) => s + v, 0),
    feedCount: monthFeeds.length,
    days
  }
}

export function getTodayStats(feeds: FeedLog[]) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const todayFeeds = feeds.filter(f => format(new Date(f.feedTime), 'yyyy-MM-dd') === today)
  return {
    total: todayFeeds.reduce((s, f) => s + f.quantityMl, 0),
    count: todayFeeds.length,
    lastFeed: todayFeeds.sort((a, b) => b.feedTime - a.feedTime)[0] || null
  }
}

export function getWeekTotal(feeds: FeedLog[]): number {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return feeds.filter(f => new Date(f.feedTime) >= weekAgo).reduce((s, f) => s + f.quantityMl, 0)
}

export function generateInsights(feeds: FeedLog[], weights: WeightLog[]): Insight[] {
  const insights: Insight[] = []
  const now = new Date()
  const thisMonth = getMonthStats(feeds, now.getFullYear(), now.getMonth() + 1)
  const lastMonth = getMonthStats(feeds, now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(), now.getMonth() === 0 ? 12 : now.getMonth())

  if (thisMonth.avgDaily > 0 && lastMonth.avgDaily > 0) {
    const pct = Math.round(((thisMonth.avgDaily - lastMonth.avgDaily) / lastMonth.avgDaily) * 100)
    if (pct > 0) insights.push({ id: '1', type: 'positive', icon: 'trending-up', text: `Monthly Growth: Average intake increased by ${pct}% compared to last month.` })
    else if (pct < 0) insights.push({ id: '1', type: 'neutral', icon: 'trending-down', text: `Monthly Change: Average intake decreased by ${Math.abs(pct)}% compared to last month.` })
  }
  if (thisMonth.highest > 0) insights.push({ id: '2', type: 'info', icon: 'award', text: `New Record: Highest intake this month was ${thisMonth.highest} ml.` })

  // Check 3 consecutive months increase
  const months = [0, 1, 2, 3].map(i => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    return getMonthStats(feeds, d.getFullYear(), d.getMonth() + 1)
  }).reverse()
  const consec = months.filter(m => m.avgDaily > 0)
  if (consec.length >= 3) {
    let increasing = true
    for (let i = 1; i < consec.length; i++) if (consec[i].avgDaily <= consec[i - 1].avgDaily) increasing = false
    if (increasing) insights.push({ id: '3', type: 'positive', icon: 'trending-up', text: `Monthly Growth: Milk intake has increased for ${consec.length} consecutive months.` })
  }

  if (weights.length >= 2) {
    const sorted = [...weights].sort((a, b) => a.recordedDate - b.recordedDate)
    const diff = sorted[sorted.length - 1].weightKg - sorted[sorted.length - 2].weightKg
    if (diff > 0) insights.push({ id: '4', type: 'positive', icon: 'scale', text: `Weight Progress: Weight increased by ${diff.toFixed(1)} kg since last measurement.` })
  }

  if (insights.length === 0) insights.push({ id: '5', type: 'info', icon: 'droplet', text: 'Start tracking feeds to see personalized insights.' })
  return insights
}

export function exportCSV(data: string[][], filename: string) {
  const content = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([content], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export function formatMl(ml: number): string {
  if (ml >= 1000) return `${(ml / 1000).toFixed(1)} L`
  return `${ml} ml`
}

export function formatTime(ts: number): string {
  return format(new Date(ts), 'h:mm a')
}

export function formatDate(ts: number): string {
  return format(new Date(ts), 'MMM d, yyyy')
}
