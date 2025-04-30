import api from '@/configs/api'
import { Learner } from '@/types/learner'

const prefix = 'instructor/manage/learners'

export const instructorLearnerApi = {
  getLearners: async (): Promise<Learner[]> => {
    const res = await api.get(`${prefix}`)
    return res.data
  },

  getLearnerProcess: async (learner: string) => {
    return await api.get(`${prefix}/${learner}`)
  },

  getWeeklyStudyTime: async (
    learner: string,
    params?: {
      start_date?: string
      end_date?: string
    }
  ) => {
    return await api.get(`${prefix}/${learner}/weekly-study-time`, { params })
  },
}
