import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import {
  CreateChapterPayload,
  UpdateChapterPayload,
} from '@/validations/chapter'
import QueryKey from '@/constants/query-key'
import { instructorChapterApi } from '@/services/instructor/chapter/chapter-api'

export const useCreateChapter = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateChapterPayload) =>
      instructorChapterApi.createChapter(data),
    onSuccess: async (res: any) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKey.INSTRUCTOR_COURSE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKey.VALIDATE_COURSE],
        }),
      ])
      toast.success(res.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateChapter = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      slug,
      id,
      data,
    }: {
      slug: string
      id: number
      data: UpdateChapterPayload
    }) => instructorChapterApi.updateChapter(slug, id, data),

    onSuccess: async (res: any) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKey.INSTRUCTOR_COURSE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKey.VALIDATE_COURSE],
        }),
      ])
      toast.success(res.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteChapter = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, id }: { slug: string; id: number }) =>
      instructorChapterApi.deleteChapter(slug, id),
    onSuccess: async (res: any) => {
      toast.success(res.message)

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKey.INSTRUCTOR_COURSE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKey.VALIDATE_COURSE],
        }),
      ])
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateChapterOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      slug,
      chapters,
    }: {
      slug: string
      chapters: { id: number; order: number }[]
    }) => {
      return instructorChapterApi.updateChapterOrder(slug, { chapters })
    },
    onSuccess: async (res: any) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKey.INSTRUCTOR_COURSE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKey.VALIDATE_COURSE],
        }),
      ])

      toast.success(res.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
