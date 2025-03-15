import api from '@/configs/api'
import { BankInfo } from '@/validations/bank'

const prefix = 'users'

export const bankApi = {
  getBanks: async (): Promise<BankInfo[]> => {
    const response = await api.get(`${prefix}/get-banking-info`)
    return response.data
  },

  addBank: async (
    data: Omit<BankInfo, 'id'>
  ): Promise<{
    message: string
    data: BankInfo[]
  }> => {
    return await api.post(`${prefix}/add-banking-info`, data)
  },

  updateBank: async (
    data: BankInfo
  ): Promise<{
    message: string
    data: BankInfo[]
  }> => {
    return await api.put(`${prefix}/update-banking-info`, data)
  },

  deleteBank: async (
    id: string
  ): Promise<{
    message: string
    data: {
      banking_info: BankInfo[]
    }
  }> => {
    return await api.delete(`${prefix}/remove-banking-info`, { data: { id } })
  },

  setDefault: async (
    id: string
  ): Promise<{
    message: string
    data: {
      banking_info: BankInfo[]
    }
  }> => {
    return await api.put(`${prefix}/set-default`, { id })
  },
}
