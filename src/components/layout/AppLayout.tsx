import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, ClipboardList, BarChart3, Scale, Settings } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/history', icon: ClipboardList, label: 'History' },
  { path: '/analytics', icon: BarChart3, label: 'Charts' },
  { path: '/weight', icon: Scale, label: 'Weight' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-16 w-56 h-56 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl" />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden sm:flex fixed left-0 top-0 h-full w-56 bg-white/60 backdrop-blur-xl border-r border-white/80 flex-col p-4 z-50">
        <div className="mb-8 px-2 pt-2">
          <h1 className="font-display font-900 text-2xl text-sky-500">BabySip</h1>
          <p className="text-xs font-body text-gray-400">Feeding tracker</p>
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all font-display font-600 text-sm
              ${isActive ? 'bg-sky-50 text-sky-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="sm:ml-56 pb-24 sm:pb-6 min-h-screen relative z-10">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-white/80 px-2 py-1 safe-area-pb pointer-events-auto">
        <div className="flex items-center justify-around">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${isActive ? 'text-sky-500' : 'text-gray-400'}`}
              >
                <item.icon className={`w-5 h-5 transition-all ${isActive ? 'scale-110' : ''}`} />
                <span className={`text-[10px] font-display font-700 ${isActive ? 'text-sky-500' : 'text-gray-400'}`}>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
