import { useQuery } from '@tanstack/react-query'
import QUERY_KEY from '@/constants/query-key'
import { bannersApi } from '@/services/home/banners/banners-api'

export const useGetBanners = () => {
  return useQuery({
    queryKey: [QUERY_KEY.BANNERS],
    queryFn: () => bannersApi.getBanners(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
