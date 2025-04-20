import QUERY_KEY from '@/constants/query-key'
import { useToastMutation } from '@/hooks/use-toast-mutation'
import { instructorProfileApi } from '@/services/instructor/profile/instructor-profile-apit'
import { useQuery } from '@tanstack/react-query'

export const useGetInstructorProfile = (code: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.INSTRUCTOR_PROFILE_INFO, code],
    queryFn: () => instructorProfileApi.getProfile(code),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetInstructorCourses = (code: string, page: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.INSTRUCTOR_PROFILE_COURSE, code, page],
    queryFn: () => instructorProfileApi.getCourses(code, page),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useCheckInstructorFollow = (
  code: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [QUERY_KEY.INSTRUCTOR_CHECK_FOLLOW, code],
    queryFn: () => instructorProfileApi.checkFollow(code),
    enabled: !!code && enabled,
  })
}

export const useFollowInstructor = () =>
  useToastMutation({
    mutationFn: instructorProfileApi.followInstructor,
    queryKeys: [
      [QUERY_KEY.INSTRUCTOR_CHECK_FOLLOW],
      [QUERY_KEY.INSTRUCTOR_PROFILE_INFO],
    ],
  })
