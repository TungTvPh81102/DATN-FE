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
  checkProfileUser: async () => {
    const response = await api.get(`${prefix}/check-profile`)
    return response.data
  },
  getRecentCourse: async () => {
    return await api.get(`/users/recentCourse`)
  },
  checkPassword: async (password: string) => {
    return await api.post(`/check-password`, { password })
  },
}
