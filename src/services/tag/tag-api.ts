import api from '@/configs/api'

const prefix = 'tags'

export const tagsApi = {
  getTags: async () => {
    return await api.get(`${prefix}`)
  },
}
