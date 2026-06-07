export interface Baby {
  id: string
  name: string
  birthDate: string
  gender: 'male' | 'female' | 'other'
  createdAt: number
}

export interface FeedLog {
  id: string
  babyId: string
  quantityMl: number
  feedTime: number
  createdAt: number
}

export interface WeightLog {
  id: string
  babyId: string
  weightKg: number
  recordedDate: number
  createdAt: number
}

export interface DayStats {
  date: string
  total: number
  count: number
  feeds: FeedLog[]
}

export interface MonthStats {
  year: number
  month: number
  label: string
  avgDaily: number
  highest: number
  lowest: number
  total: number
  feedCount: number
  days: DayStats[]
}

export interface Insight {
  id: string
  type: 'positive' | 'neutral' | 'info'
  icon: string
  text: string
}

export interface BackupData {
  version: string
  exportedAt: number
  babies: Baby[]
  feedLogs: FeedLog[]
  weightLogs: WeightLog[]
}
