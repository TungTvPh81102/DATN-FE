import { create } from 'zustand'

interface CurrentTimeStore {
  currentTime: number
  setCurrentTime: (time: number) => void
}

export const useCurrentTimeStore = create<CurrentTimeStore>((set) => ({
  currentTime: 0,
  setCurrentTime: (time: number) => set({ currentTime: time }),
}))
