import { useMutation, useQuery } from '@tanstack/react-query'
import QUERY_KEY from '@/constants/query-key'
import { chatApi } from '@/services/chat/chat-api'
import {
  AddMemberGroupChatPayload,
  CreateGroupChatPayload,
  MessagePayload,
} from '@/validations/chat'

export const useGetDirectChats = () => {
  return useQuery({
    queryKey: [QUERY_KEY.GROUP_DIRECT],
    queryFn: () => chatApi.getDirectChats(),
  })
}

export const useGetGroupChats = () => {
  return useQuery({
    queryKey: [QUERY_KEY.GROUP_CHAT],
    queryFn: () => chatApi.getGroupChats(),
  })
}

export const useGetGroupStudent = () => {
  return useQuery({
    queryKey: [QUERY_KEY.GROUP_CHAT],
    queryFn: () => chatApi.getGroupStudent(),
  })
}

export const useGetInfoGroupChat = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.GROUP_CHAT, id],
    queryFn: () => chatApi.getInfoGroupChat(id!),
    enabled: !!id,
  })
}

export const useGetRemainingMembers = (channelId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.GROUP_CHAT, channelId],
    queryFn: () => chatApi.getRemainingMembers(channelId!),
    enabled: !!channelId,
  })
}

export const useGetMessage = (conversation_id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.GROUP_CHAT, conversation_id],
    queryFn: () => chatApi.getMessages(conversation_id!),
    enabled: !!conversation_id,
  })
}

export const useCreateGroupChat = () => {
  return useMutation({
    mutationFn: (data: CreateGroupChatPayload) => chatApi.createGroupChat(data),
  })
}

export const useAddMemberGroupChat = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: AddMemberGroupChatPayload
    }) => chatApi.addMemberGroupChat(id, data),
  })
}

export const useStartDirectChat = () => {
  return useMutation({
    mutationFn: ({ recipient_id }: { recipient_id: number }) =>
      chatApi.startDirectChat(recipient_id),
  })
}

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (data: MessagePayload) => chatApi.sendMessage(data),
  })
}
