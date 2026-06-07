import { v4 as uuidv4 } from 'uuid'
import { subDays, subMonths, setHours, setMinutes } from 'date-fns'
import { db } from '../db'
import type { Baby, FeedLog, WeightLog } from '../types'

export async function generateDemoData(): Promise<Baby> {
  const babyId = uuidv4()
  const baby: Baby = {
    id: babyId,
    name: 'Baby Emma',
    birthDate: format6MonthsAgo(),
    gender: 'female',
    createdAt: Date.now()
  }
  await db.babies.put(baby)

  const feedLogs: FeedLog[] = []
  const weightLogs: WeightLog[] = []

  // 6 months of feed data
  for (let dayOffset = 180; dayOffset >= 0; dayOffset--) {
    const day = subDays(new Date(), dayOffset)
    const baseQty = 80 + Math.round((180 - dayOffset) / 180 * 60) // grows from 80 to 140ml
    const feedTimes = [6, 9, 12, 15, 18, 21]
    for (const hour of feedTimes) {
      if (Math.random() > 0.1) { // 90% chance of each feed
        const t = setMinutes(setHours(day, hour), Math.floor(Math.random() * 30))
        feedLogs.push({
          id: uuidv4(), babyId,
          quantityMl: baseQty + Math.round((Math.random() - 0.5) * 40),
          feedTime: t.getTime(),
          createdAt: t.getTime()
        })
      }
    }
  }

  // Monthly weight logs
  for (let m = 6; m >= 0; m--) {
    const d = subMonths(new Date(), m)
    weightLogs.push({
      id: uuidv4(), babyId,
      weightKg: parseFloat((3.5 + (6 - m) * 0.5 + Math.random() * 0.1).toFixed(1)),
      recordedDate: d.getTime(),
      createdAt: d.getTime()
    })
  }

  await db.feedLogs.bulkPut(feedLogs)
  await db.weightLogs.bulkPut(weightLogs)
  return baby
}

function format6MonthsAgo(): string {
  const d = subMonths(new Date(), 6)
  return d.toISOString().split('T')[0]
}
