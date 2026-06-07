import React, { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      // Prevent scrolling on html too for better iOS support
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => { 
      document.body.style.overflow = '' 
      document.documentElement.style.overflow = ''
    }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center pointer-events-none">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" 
        onClick={onClose}
        role="presentation"
      />
      <div className="relative w-full sm:max-w-md bg-white/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-glass-lg animate-slide-up max-h-[90vh] flex flex-col pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-0 pointer-events-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-display font-800 text-lg text-gray-800">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors text-lg">
            ×
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
