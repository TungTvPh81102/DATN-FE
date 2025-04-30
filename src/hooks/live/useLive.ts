import { useMutation, useQuery } from '@tanstack/react-query'

import {
  CreateLiveSessionMessagePayload,
  CreateLiveStreamPayload,
} from '@/validations/live'
import QueryKey from '@/constants/query-key'
import { liveSteamApi } from '@/services/live/live'
import { useToastMutation } from '@/hooks/use-toast-mutation'
import { GetLiveSessionParams } from '@/types/Live'

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

export const useGetLiveSessionClient = (params: GetLiveSessionParams) => {
  return useQuery({
    queryKey: [QueryKey.LIVE_SESSION_CLIENT, params],
    queryFn: () => liveSteamApi.getLiveSessionClient(params),
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

export const useLiveSessionInfo = (code: string) => {
  return useQuery({
    queryKey: [QueryKey.LIVE_SESSION_CLIENT, code],
    queryFn: () => liveSteamApi.getLiveSession(code!),
    enabled: !!code,
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

export const useGetLiveSchedules = () => {
  return useQuery({
    queryFn: () => liveSteamApi.getLiveSchedules(),
    queryKey: [QueryKey.LIVE_SCHEDULE],
  })
}

export const useGetLiveSchedule = (code: string) => {
  return useQuery({
    queryFn: () => liveSteamApi.getLiveSchedule(code),
    queryKey: [QueryKey.LIVE_SCHEDULE, code],
    enabled: !!code,
  })
}

export const useCreateLiveSchedule = () => {
  return useToastMutation({
    mutationFn: liveSteamApi.createLiveSchedule,
    queryKey: [QueryKey.LIVE_SCHEDULE],
  })
}
