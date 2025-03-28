import { useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { instructorLearnerApi } from '@/services/instructor/learner-api'

export const useGetLearners = () => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_LEARNER],
    queryFn: () => instructorLearnerApi.getLearners(),
  })
}

export const useGetLearnerProcess = (
  learner: string,
  params?: {
    start_date?: string
    end_date?: string
  }
) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_LEARNER, learner, params],
    queryFn: () => instructorLearnerApi.getLearnerProcess(learner, params),
    enabled: !!learner,
  })
}
