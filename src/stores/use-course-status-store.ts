import { CourseStatus } from '@/types'
import { create } from 'zustand'

interface CourseStatusStore {
  courseStatus?: `${CourseStatus}`
  setCourseStatus: (status?: `${CourseStatus}`) => void
  isDraftOrRejected: boolean
}

export const useCourseStatusStore = create<CourseStatusStore>((set) => ({
  courseStatus: undefined,
  setCourseStatus: (status) =>
    set({
      courseStatus: status,
      isDraftOrRejected:
        status === CourseStatus.DRAFT || status === CourseStatus.REJECT,
    }),
  isDraftOrRejected: true,
}))
