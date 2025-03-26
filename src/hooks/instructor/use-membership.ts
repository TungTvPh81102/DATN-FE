import { useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { memberShipApi } from '@/services/instructor/membership-api'
import { useToastMutation } from '../use-toast-mutation'

export const useGetMemberships = () => {
  return useQuery({
    queryKey: [QueryKey.MEMBERSHIPS],
    queryFn: memberShipApi.getMemberships,
  })
}

export const useGetMembership = (code: string | null) => {
  return useQuery({
    queryKey: [QueryKey.MEMBERSHIPS, code],
    queryFn: () => memberShipApi.getMembership(code!),
    enabled: !!code,
  })
}

export const useCreateMembership = () => {
  return useToastMutation({
    mutationFn: memberShipApi.createMembership,
    queryKey: [QueryKey.MEMBERSHIPS],
  })
}

export const useUpdateMembership = () => {
  return useToastMutation({
    mutationFn: memberShipApi.updateMembership,
    queryKey: [QueryKey.MEMBERSHIPS],
  })
}

export const useToggleStatusMembership = () => {
  return useToastMutation({
    mutationFn: memberShipApi.toggleStatusMembership,
    queryKey: [QueryKey.MEMBERSHIPS],
  })
}

export const useSendMembershipRequest = () => {
  return useToastMutation({
    mutationFn: memberShipApi.sendMembershipRequest,
    queryKey: [QueryKey.MEMBERSHIPS],
  })
}
