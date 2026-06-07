import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BabyProvider } from './context/BabyContext'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/Dashboard'
import { HistoryPage } from './pages/History'
import { AnalyticsPage } from './pages/Analytics'
import { WeightPage } from './pages/Weight'
import { SettingsPage } from './pages/Settings'

export default function App() {
  return (
    <BabyProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/weight" element={<WeightPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </BabyProvider>
  )
}
