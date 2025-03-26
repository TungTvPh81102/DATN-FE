import { useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { tagsApi } from '@/services/tag/tag-api'

export const useGetTags = () => {
  return useQuery({
    queryKey: [QueryKey.TAGS],
    queryFn: () => tagsApi.getTags(),
  })
}
