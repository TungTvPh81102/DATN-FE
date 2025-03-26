import { useQuery } from '@tanstack/react-query'
import QueryKey from '@/constants/query-key'
import { postApi } from '@/services/post/post-api'

export const useGetTopPosts = () => {
  return useQuery({
    queryKey: [QueryKey.TOP_POSTS],
    queryFn: () => postApi.getTopPost(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
