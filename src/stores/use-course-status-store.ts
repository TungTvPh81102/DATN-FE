import { CourseStatus } from '@/types'
import { create } from 'zustand'

interface CourseStatusStore {
  courseStatus: CourseStatus | null
  modificationRequest: number | null
  isDraftOrRejected: boolean
  setCourseStatus: (
    status: CourseStatus | null,
    modificationRequest?: number | null
  ) => void
}

export const useCourseStatusStore = create<CourseStatusStore>((set) => ({
  courseStatus: null,
  modificationRequest: null,
  isDraftOrRejected: false,
  setCourseStatus: (status, modificationRequest = null) =>
    set(() => ({
      courseStatus: status,
      modificationRequest,
      isDraftOrRejected:
        status === CourseStatus.DRAFT || status === CourseStatus.REJECT,
    })),
}))
