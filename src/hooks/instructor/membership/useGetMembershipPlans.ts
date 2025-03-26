import { useQuery } from '@tanstack/react-query'
import QueryKey from '@/constants/query-key'
import { instructorMemberShipApi } from '@/services/instructor/membership/membership-api'

export const useGetMembershipPlans = (code: string) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_MEMBERSHIP_PLANS, code],
    queryFn: () => instructorMemberShipApi.getMemberShipPlans(code),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
