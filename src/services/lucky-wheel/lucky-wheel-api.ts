import api from '@/configs/api'

const prefix = 'spins'
export const luckyWheelApi = {
  //danh sach phan thuong
  getRewards: async () => {
    return await api.get(`${prefix}/rewards`)
  },

  // lich su quay
  getSpinHistory: async () => {
    return await api.get(`${prefix}/user/spin-history`)
  },

  // Lấy số lượt quay còn lại của người dùng
  getSpinTurn: async () => {
    return await api.get(`${prefix}/user/turn`)
  },

  //an nut quay vong quay
  spinRun: async () => {
    return await api.post(`${prefix}/spin`)
  },
}
