import Dexie, { Table } from 'dexie'
import type { Baby, FeedLog, WeightLog } from '../types'

export class BabySipDB extends Dexie {
  babies!: Table<Baby, string>
  feedLogs!: Table<FeedLog, string>
  weightLogs!: Table<WeightLog, string>

  constructor() {
    super('BabySipDB')
    this.version(1).stores({
      babies: 'id, createdAt',
      feedLogs: 'id, babyId, feedTime, createdAt',
      weightLogs: 'id, babyId, recordedDate, createdAt'
    })
  }
}

export const db = new BabySipDB()
