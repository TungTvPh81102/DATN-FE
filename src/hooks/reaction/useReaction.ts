import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IReactionPayload, reactionApi } from '@/services/reaction/reaction-api'
import QueryKey from '@/constants/query-key'

export const useToggleReaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IReactionPayload) => reactionApi.toggleReaction(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.REACTION_WITH_COMMENT],
      })
    },
  })
}

export const useGetReactionWithComment = (commentId: string) => {
  return useQuery({
    queryKey: [QueryKey.REACTION_WITH_COMMENT, commentId],
    queryFn: () => reactionApi.getReactionWithComment(commentId!),
  })
}
