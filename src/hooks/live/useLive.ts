import { useMutation, useQuery } from '@tanstack/react-query'

import {
  CreateLiveSessionMessagePayload,
  CreateLiveStreamPayload,
} from '@/validations/live'
import QueryKey from '@/constants/query-key'
import { liveSteamApi } from '@/services/live/live'

export const useGetLiveSessions = (filters?: {
  fromDate?: string | undefined
  toDate?: string | undefined
}) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_LIVE_SESSIONS],
    queryFn: () => liveSteamApi.getLiveSessions(filters),
    // keepPreviousData: true,
  })
}

export const useGetLiveSessionClient = () => {
  return useQuery({
    queryKey: [QueryKey.LIVE_SESSION_CLIENT],
    queryFn: () => liveSteamApi.getLiveSessionClient(),
  })
}

export const useGetStreamKey = () => {
  return useQuery({
    queryKey: [QueryKey.STREAM_KEY],
    queryFn: () => liveSteamApi.getStreamKey(),
  })
}

export const useGenerateStreamKey = () => {
  return useMutation({
    mutationFn: () => liveSteamApi.generateStreamKey(),
  })
}

export const useCreateLiveSteam = () => {
  return useMutation({
    mutationFn: (data: CreateLiveStreamPayload) =>
      liveSteamApi.createLiveStream(data),
  })
}

export const useLiveSessionInfo = (id: string) => {
  return useQuery({
    queryKey: [QueryKey.LIVE_SESSION_CLIENT, id],
    queryFn: () => liveSteamApi.getLiveSession(id!),
    enabled: !!id,
  })
}

export const useJoinLiveSession = () => {
  return useMutation({
    mutationFn: (id: string) => liveSteamApi.joinLiveSession(id),
  })
}

export const useSendMessageLive = () => {
  return useMutation({
    mutationFn: ({
      liveSessionId,
      data,
    }: {
      liveSessionId: string
      data: CreateLiveSessionMessagePayload
    }) => liveSteamApi.sendMessageLive(liveSessionId, data),
  })
}
