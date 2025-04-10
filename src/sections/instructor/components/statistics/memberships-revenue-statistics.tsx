import { useGetMonthlyMembershipRevenueStatistics } from '@/hooks/instructor/use-statistic'

export const MembershipsRevenueStatistics = () => {
  const { data, isLoading } = useGetMonthlyMembershipRevenueStatistics()

  console.log(data)
  console.log(isLoading)
  return <h1>Hello</h1>
}
