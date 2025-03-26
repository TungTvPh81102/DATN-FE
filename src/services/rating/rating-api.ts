import api from '@/configs/api'
import { IRatingAboutPageResponse } from '@/types'

const prefix = 'ratings'

export const ratingApi = {
  storeRating: async (data: any) => {
    return await api.post(`${prefix}`, data)
  },
  checkCourseRatingState: async (slug: string) => {
    return await api.get(`${prefix}/${slug}/checkCourseState`)
  },
  getRatingAboutPage: async (): Promise<IRatingAboutPageResponse> => {
    return await api.get('get-ratings')
  },
}
