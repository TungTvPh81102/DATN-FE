import api from '@/configs/api'

const prefix = '/blogs'

export const blogApi = {
  getBlogs: async () => {
    return await api.get(prefix)
  },
  getBlogBySlug: async (slug: string) => {
    return await api.get(`${prefix}/${slug}`)
  },
  getCategoryBlogs: async (slug: string) => {
    return await api.get(`${prefix}/category/${slug}`)
  },
}
