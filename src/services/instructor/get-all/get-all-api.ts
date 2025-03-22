import api from '@/configs/api'
import { ITopInstructorResponse } from '@/types'

export const instructorApi = {
  getAll: async () => {
    return await api.get('/instructor-order-by-count-course')
  },
  getTopInstructors: async (): Promise<ITopInstructorResponse> => {
    return await api.get('top-instructors')
  },
}
