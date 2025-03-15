import api from '@/configs/api'

const prefix = 'create-payment'

export const paymentApi = {
  createPayment: async (data: { amount: number }) => {
    return await api.post(`${prefix}`, data)
  },
}
