import {
  CreateLiveSessionMessagePayload,
  CreateLiveStreamPayload,
  LiveSchedulePayload,
} from '@/validations/live'
import api from '@/configs/api'
import { GetLiveSessionParams, GetLiveSessionResponse } from '@/types/Live'

const prefix = 'instructor/livestreams'

export const liveSteamApi = {
  generateStreamKey: async () => {
    return await api.post(`${prefix}/generate-stream-key`)
  },
  getStreamKey: async () => {
    const res = await api.get(`${prefix}/get-stream-key`)
    return res.data
  },
  getLiveSessionClient: async (
    params: GetLiveSessionParams
  ): Promise<GetLiveSessionResponse> => {
    const res = await api.get(`livestreams`, { params })
    return res.data
  },
  getLiveSessions: async (params?: {
    fromDate?: string | undefined
    toDate?: string | undefined
  }) => {
    return await api.get(`${prefix}`, {
      params,
    })
  },
  getLiveSession: async (code: string) => {
    const res = await api.get(`livestreams/${code}`)
    return res.data
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
  getLiveSchedules: async () => {
    const res = await api.get(`${prefix}/schedule`)
    return res.data
  },
  getLiveSchedule: async (code: string) => {
    const res = await api.get(`${prefix}/schedule/${code}`)
    return res.data
  },
  createLiveSchedule: (data: LiveSchedulePayload) => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('description', data.description || '')
    formData.append('visibility', data.visibility)
    formData.append('starts_at', data.starts_at?.toISOString() || '')

    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail)
    }

    return api.post(`${prefix}/schedule`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  sendHeartbeat: async (liveSessionId: number) => {
    return await api.post(`/livestreams/${liveSessionId}/heartbeat`)
  },
  leaveStream: async (liveSessionId: number) => {
    return await api.post(`/livestreams/${liveSessionId}/leave`)
  },
}
