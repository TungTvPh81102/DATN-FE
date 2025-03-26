import { useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { orderApi } from '@/services/order/order-api'

export const useGetOrders = () => {
  return useQuery({
    queryKey: [QueryKey.ORDER],
    queryFn: () => orderApi.getOrders(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetOrderById = (id?: number) => {
  return useQuery({
    queryKey: [QueryKey.ORDER, id],
    queryFn: () => orderApi.getOrderDetail(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetMemberships = () => {
  return useQuery({
    queryKey: [QueryKey.MEMBERSHIPS],
    queryFn: () => orderApi.getMemberships(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
