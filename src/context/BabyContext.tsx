import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { db } from '../db'
import type { Baby } from '../types'

interface BabyContextType {
  activeBaby: Baby | null
  babies: Baby[]
  setActiveBaby: (baby: Baby | null) => void
  refreshBabies: () => Promise<void>
}

const BabyContext = createContext<BabyContextType>({
  activeBaby: null,
  babies: [],
  setActiveBaby: () => {},
  refreshBabies: async () => {}
})

export function BabyProvider({ children }: { children: ReactNode }) {
  const [activeBaby, setActiveBabyState] = useState<Baby | null>(null)
  const [babies, setBabies] = useState<Baby[]>([])

  const refreshBabies = async () => {
    const all = await db.babies.orderBy('createdAt').toArray()
    setBabies(all)
    if (!activeBaby && all.length > 0) setActiveBabyState(all[0])
    if (activeBaby) {
      const updated = all.find(b => b.id === activeBaby.id)
      if (updated) setActiveBabyState(updated)
    }
  }

  useEffect(() => { refreshBabies() }, [])

  const setActiveBaby = (baby: Baby | null) => {
    setActiveBabyState(baby)
    if (baby) localStorage.setItem('activeBabyId', baby.id)
  }

  return (
    <BabyContext.Provider value={{ activeBaby, babies, setActiveBaby, refreshBabies }}>
      {children}
    </BabyContext.Provider>
  )
}

export const useBaby = () => useContext(BabyContext)
