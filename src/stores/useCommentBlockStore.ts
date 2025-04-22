import { create } from 'zustand/index'
import { persist } from 'zustand/middleware'

interface CommentBlockState {
  isBlocked: boolean
  expiryTimestamp: number
  blockDuration: number
  setBlockState: (isBlocked: boolean, duration: number) => void
  clearBlockState: () => void
  getRemainingTime: () => number
}

export const useCommentBlockStore = create<CommentBlockState>()(
  persist(
    (set, get) => ({
      isBlocked: false,
      expiryTimestamp: 0,
      blockDuration: 0,

      setBlockState: (isBlocked: boolean, duration: number) => {
        const expiryTimestamp = isBlocked ? Date.now() + duration * 1000 : 0
        set({ isBlocked, expiryTimestamp, blockDuration: duration })
      },

      clearBlockState: () =>
        set({ isBlocked: false, expiryTimestamp: 0, blockDuration: 0 }),

      getRemainingTime: () => {
        const { isBlocked, expiryTimestamp } = get()
        if (!isBlocked) return 0

        const remaining = Math.max(
          0,
          Math.floor((expiryTimestamp - Date.now()) / 1000)
        )
        if (remaining <= 0) {
          get().clearBlockState()
          return 0
        }
        return remaining
      },
    }),
    {
      name: 'comment-block-storage',
      partialize: (state) => ({
        isBlocked: state.isBlocked,
        expiryTimestamp: state.expiryTimestamp,
        blockDuration: state.blockDuration,
      }),
    }
  )
)
