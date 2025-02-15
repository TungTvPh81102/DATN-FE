import { CreatePostPayload, UpdatePostPayload } from '@/validations/post'
import api from '@/configs/api'

const prefix = '/instructor/posts'

export const instructorPostApi = {
  getPosts: async () => {
    return await api.get(prefix)
  },
  getPostBySlug: async (slug: string) => {
    return await api.get(`${prefix}/${slug}`)
  },
  createPost: (payload: CreatePostPayload) => {
    return api.post(prefix, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  updatePost: (slug: string, data: UpdatePostPayload) => {
    return api.post(`${prefix}/${slug}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
