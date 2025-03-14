import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import QUERY_KEY from '@/constants/query-key'
import { toast } from 'react-toastify'
import { instructorProfileApi } from '@/services/instructor/profile/instructor-profile-apit'

export const useGetInstructorProfile = (code: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.INSTRUCTOR_PROFILE_INFO, code],
    queryFn: () => instructorProfileApi.getProfile(code),
  })
}

export const useGetInstructorCourses = (code: string, page: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.INSTRUCTOR_PROFILE_COURSE, code, page],
    queryFn: () => instructorProfileApi.getCourses(code, page),
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

export const useFollowInstructor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ code }: { code: string }) =>
      instructorProfileApi.followInstructor(code),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.INSTRUCTOR_CHECK_FOLLOW],
      })
    },
    onError: (error) => {
      if (error.message) {
        toast.error('Vui lòng đăng nhập trước khi thực hiện!')
      }
    },
  })
}
