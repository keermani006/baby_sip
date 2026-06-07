import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { useBaby } from '../context/BabyContext'
import type { FeedLog, WeightLog, Baby } from '../types'

export function useFeeds(): FeedLog[] {
  const { activeBaby } = useBaby()
  return (useLiveQuery(
    () => activeBaby ? db.feedLogs.where('babyId').equals(activeBaby.id).sortBy('feedTime') : Promise.resolve([] as FeedLog[]),
    [activeBaby?.id]
  ) ?? []) as FeedLog[]
}

export function useWeights(): WeightLog[] {
  const { activeBaby } = useBaby()
  return (useLiveQuery(
    () => activeBaby ? db.weightLogs.where('babyId').equals(activeBaby.id).sortBy('recordedDate') : Promise.resolve([] as WeightLog[]),
    [activeBaby?.id]
  ) ?? []) as WeightLog[]
}

export function useAllBabies(): Baby[] {
  return (useLiveQuery(() => db.babies.orderBy('createdAt').toArray()) ?? []) as Baby[]
}
