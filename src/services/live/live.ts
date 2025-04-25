import {
  CreateLiveSessionMessagePayload,
  CreateLiveStreamPayload,
} from '@/validations/live'
import api from '@/configs/api'

const prefix = 'instructor/livestreams'

export const liveSteamApi = {
  generateStreamKey: async () => {
    return await api.post(`${prefix}/generate-stream-key`)
  },
  getStreamKey: async () => {
    const res = await api.get(`${prefix}/get-stream-key`)
    return res.data
  },
  getLiveSessionClient: async () => {
    return await api.get(`livestreams`)
  },
  getLiveSessions: async (params?: {
    fromDate?: string | undefined
    toDate?: string | undefined
  }) => {
    return await api.get(`${prefix}`, {
      params,
    })
  },
  getLiveSession: async (id: string) => {
    return await api.get(`livestreams/${id}`)
  },
  createLiveStream: (data: CreateLiveStreamPayload) =>
    api.post(`${prefix}`, data),
  joinLiveSession: async (id: string) => {
    return await api.post(`livestreams/${id}/join`)
  },
  sendMessageLive(
    liveSessionId: string,
    data: CreateLiveSessionMessagePayload
  ) {
    return api.post(`livestreams/${liveSessionId}/send-message`, data)
  },
}
