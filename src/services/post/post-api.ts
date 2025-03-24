import api from '@/configs/api'
import { ITopPostResponse } from '@/types'

export const postApi = {
  getTopPost: async (): Promise<ITopPostResponse> => {
    return await api.get('get-posts')
  },
}
