import api from '@/configs/api'

const prefix = 'users'

export const userApi = {
  getMyCourses: async () => {
    return await api.get(`${prefix}/my-courses`)
  },
  getProgress: async (course: string): Promise<number> => {
    const response = await api.get(`${prefix}/courses/${course}/progress`)
    return response.data.progress_percent
  },
  getCouponUser: async () => {
    return await api.get(`${prefix}/coupons`)
  },
  generateCertificate: async (slug: string) => {
    return await api.get(`${prefix}/certificate/${slug}`)
  },
  getCertificate: async () => {
    return await api.get(`${prefix}/certificates`)
  },
  downloadCertificate: async (slug: string) => {
    const response = await api.get(`${prefix}/courses/${slug}/certificate`)
    return response.data
  },
}
