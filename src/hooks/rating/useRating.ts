import { useMutation, useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { ratingApi } from '@/services/rating/rating-api'

export const useStoreRating = () => {
  return useMutation({
    mutationFn: (data: any) => ratingApi.storeRating(data),
  })
}

export const useCheckCourseRatingState = (slug?: string) => {
  return useQuery({
    queryKey: [QueryKey.COURSE_RATING_STATE, slug],
    queryFn: () => ratingApi.checkCourseRatingState(slug!),
    enabled: !!slug,
  })
}

export const useGetRatingAboutPage = () => {
  return useQuery({
    queryKey: [QueryKey.RATING_ABOUT_PAGE],
    queryFn: () => ratingApi.getRatingAboutPage(),
  })
}
