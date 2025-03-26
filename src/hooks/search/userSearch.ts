import { useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { searchApi } from '@/services/search/search-api'

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: [QueryKey.SEARCH, query],
    queryFn: () => searchApi.getDataBySearchQuery(query),
    enabled: !!query.trim() && query.length > 1,
  })
}
