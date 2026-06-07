import React, { useRef, useState } from 'react'
import { format } from 'date-fns'
import { PageHeader } from '../components/layout/PageHeader'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { useFeeds, useWeights, useAllBabies } from '../hooks/useData'
import { useBaby } from '../context/BabyContext'
import { db } from '../db'
import { exportCSV, downloadJSON } from '../utils'
import { generateDemoData } from '../utils/demo'
import {
  Upload,
  Database,
  FolderOpen,
  Trash2,
  RefreshCw,
  Droplet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import type { BackupData } from '../types'

function SettingRow({ icon, label, sublabel, onClick, variant = 'default' }: {
  icon: React.ReactNode; label: string; sublabel?: string; onClick: () => void; variant?: string
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50/80 transition-colors rounded-xl">
      <div className={`w-8 flex justify-center shrink-0 ${variant === 'danger' ? 'text-red-500' : 'text-gray-400'}`}>{icon}</div>
      <div className="flex-1 text-left">
        <p className={`font-display font-700 text-sm ${variant === 'danger' ? 'text-red-500' : 'text-gray-700'}`}>{label}</p>
        {sublabel && <p className="text-xs font-body text-gray-400">{sublabel}</p>}
      </div>
      <span className="text-gray-300 text-sm">›</span>
    </button>
  )
}

export function SettingsPage() {
  const feeds = useFeeds()
  const weights = useWeights()
  const babies = useAllBabies()
  const { activeBaby, refreshBabies, setActiveBaby } = useBaby()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [demoLoading, setDemoLoading] = useState(false)
  const [restoreStatus, setRestoreStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const exportFeedCSV = () => {
    const rows = [['Date', 'Time', 'Quantity (ml)'], ...feeds.map(f => [
      format(new Date(f.feedTime), 'yyyy-MM-dd'),
      format(new Date(f.feedTime), 'HH:mm'),
      String(f.quantityMl)
    ])]
    exportCSV(rows, `babysip-feeds-${format(new Date(), 'yyyy-MM-dd')}.csv`)
  }

  const exportWeightCSV = () => {
    const rows = [['Date', 'Weight (kg)'], ...weights.map(w => [
      format(new Date(w.recordedDate), 'yyyy-MM-dd'),
      String(w.weightKg)
    ])]
    exportCSV(rows, `babysip-weights-${format(new Date(), 'yyyy-MM-dd')}.csv`)
  }

  const backupData = async () => {
    const allFeeds = await db.feedLogs.toArray()
    const allWeights = await db.weightLogs.toArray()
    const allBabies = await db.babies.toArray()
    const backup: BackupData = {
      version: '1.0',
      exportedAt: Date.now(),
      babies: allBabies,
      feedLogs: allFeeds,
      weightLogs: allWeights
    }
    downloadJSON(backup, `babysip-backup-${format(new Date(), 'yyyy-MM-dd')}.json`)
  }

  const restoreData = async (file: File) => {
    try {
      const text = await file.text()
      const data: BackupData = JSON.parse(text)
      if (!data.babies || !data.feedLogs || !data.weightLogs) throw new Error('Invalid backup')
      await db.babies.bulkPut(data.babies)
      await db.feedLogs.bulkPut(data.feedLogs)
      await db.weightLogs.bulkPut(data.weightLogs)
      await refreshBabies()
      setRestoreStatus({ type: 'success', message: 'Restored successfully!' })
    } catch (e) {
      setRestoreStatus({ type: 'error', message: 'Restore failed. Invalid backup file.' })
    }
  }

  const clearAll = async () => {
    if (!confirm('This will delete ALL data. Are you sure?')) return
    await db.feedLogs.clear()
    await db.weightLogs.clear()
    await db.babies.clear()
    setActiveBaby(null)
    await refreshBabies()
  }

  const addDemo = async () => {
    setDemoLoading(true)
    try {
      const baby = await generateDemoData()
      await refreshBabies()
      setActiveBaby(baby)
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" />
      <div className="px-4 space-y-4 pb-4">

        {/* Export */}
        <GlassCard>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-display font-800 text-xs text-gray-400 uppercase tracking-wide">Export Data</p>
          </div>
          <SettingRow icon={<Upload className="w-5 h-5" />} label="Export Feed Logs CSV" sublabel={`${feeds.length} records`} onClick={exportFeedCSV} />
          <SettingRow icon={<Upload className="w-5 h-5" />} label="Export Weight Logs CSV" sublabel={`${weights.length} records`} onClick={exportWeightCSV} />
        </GlassCard>

        {/* Backup */}
        <GlassCard>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-display font-800 text-xs text-gray-400 uppercase tracking-wide">Backup & Restore</p>
          </div>
          <SettingRow icon={<Database className="w-5 h-5" />} label="Backup All Data" sublabel="Downloads babysip-backup.json" onClick={backupData} />
          <SettingRow icon={<FolderOpen className="w-5 h-5" />} label="Restore from Backup" sublabel="Import a backup file" onClick={() => fileInputRef.current?.click()} />
          {restoreStatus && (
            <div className={`mx-4 mb-3 px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-body ${
              restoreStatus.type === 'success' ? 'bg-mint-50 text-mint-500 border border-mint-100' : 'bg-red-50 text-red-500 border border-red-100'
            }`}>
              {restoreStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{restoreStatus.message}</span>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".json" className="hidden"
            onChange={e => e.target.files?.[0] && restoreData(e.target.files[0])} />
        </GlassCard>

        {/* Demo */}
        <GlassCard>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-display font-800 text-xs text-gray-400 uppercase tracking-wide">Demo</p>
          </div>
          <div className="p-4">
            <p className="text-sm font-body text-gray-500 mb-3">
              Generate 6 months of sample data to explore all features.
            </p>
            <Button variant="secondary" onClick={addDemo} loading={demoLoading} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Demo Data
            </Button>
          </div>
        </GlassCard>

        {/* Danger */}
        <GlassCard>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-display font-800 text-xs text-red-400 uppercase tracking-wide">Danger Zone</p>
          </div>
          <SettingRow icon={<Trash2 className="w-5 h-5" />} label="Clear All Data" sublabel="Permanently delete everything" onClick={clearAll} variant="danger" />
        </GlassCard>

        {/* About */}
        <GlassCard className="p-5 text-center">
          <div className="flex justify-center mb-2 text-sky-500">
            <Droplet className="w-8 h-8" />
          </div>
          <h2 className="font-display font-900 text-xl text-sky-500">BabySip</h2>
          <p className="text-xs font-body text-gray-400 mt-1">Version 1.0.0 · All data stored locally</p>
          <p className="text-xs font-body text-gray-300 mt-0.5">No cloud · No account · 100% private</p>
        </GlassCard>
      </div>
    </div>
  )
}
