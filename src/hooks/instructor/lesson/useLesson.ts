import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { UpdateCodingLessonPayload } from '@/validations/course'
import {
  CreateLessonPayload,
  LessonCodingPayload,
  LessonQuizPayload,
  UpdateTitleLessonPayload,
} from '@/validations/lesson'
import QueryKey from '@/constants/query-key'
import { instructorLessonApi } from '@/services/instructor/lesson/lesson-api'
import { useToastMutation } from '@/hooks/use-toast-mutation'

export const useGetLessonCoding = (lessonSlug: string, codingId: string) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_LESSON_CODING, lessonSlug, codingId],
    queryFn: () => instructorLessonApi.getLessonCoding(lessonSlug, codingId),
    enabled: !!codingId,
  })
}

export const useGetLessonVideo = (chapterId: string, lessonId: string) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_LESSON_VIDEO, chapterId, lessonId],
    queryFn: () => instructorLessonApi.getLessonVideo(chapterId, lessonId),
    enabled: !!lessonId,
  })
}
export const useGetLessonDocument = (chapterId: string, lessonId: string) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_LESSON_DOCUMENT, chapterId, lessonId],
    queryFn: () => instructorLessonApi.getLessonDocument(chapterId, lessonId),
    enabled: !!lessonId,
  })
}

export const useCreateLessonVideo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chapterId,
      payload,
    }: {
      chapterId: string
      payload: FormData
    }) => instructorLessonApi.createLessonVideo(chapterId, payload),
    onSuccess: async (res) => {
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

export const useUpdateLessonVideo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chapterId,
      lessonId,
      payload,
    }: {
      chapterId: string
      lessonId: string
      payload: FormData
    }) => instructorLessonApi.updateLessonVideo(chapterId, lessonId, payload),
    onSuccess: async (res) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKey.INSTRUCTOR_COURSE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKey.VALIDATE_COURSE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKey.INSTRUCTOR_LESSON_VIDEO],
        }),
      ])

      toast.success(res.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useCreateLessonDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chapterId,
      payload,
    }: {
      chapterId: string
      payload: FormData
    }) => instructorLessonApi.createLessonDocument(chapterId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKey.INSTRUCTOR_COURSE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKey.VALIDATE_COURSE],
        }),
      ])
    },
  })
}

export const useUpdateLessonDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chapterId,
      lessonId,
      payload,
    }: {
      chapterId: string
      lessonId: string
      payload: FormData
    }) =>
      instructorLessonApi.updateLessonDocument(chapterId, lessonId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKey.INSTRUCTOR_COURSE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKey.VALIDATE_COURSE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKey.INSTRUCTOR_LESSON_DOCUMENT],
        }),
      ])
    },
  })
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLessonPayload) =>
      instructorLessonApi.createLesson(data),
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_COURSE],
      })

      await queryClient.invalidateQueries({
        queryKey: [QueryKey.VALIDATE_COURSE],
      })
      toast.success(res.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useCreateLessonCoding = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chapterId,
      payload,
    }: {
      chapterId: string
      payload: LessonCodingPayload
    }) => instructorLessonApi.createLessonCoding(chapterId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_COURSE_VALIDATE],
      })
    },
  })
}

export const useCreateLessonQuiz = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chapterId,
      payload,
    }: {
      chapterId: string
      payload: LessonQuizPayload
    }) => instructorLessonApi.createLessonQuiz(chapterId, payload),

    onSuccess: async (res) => {
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

export const useUpdateQuizContent = () => {
  return useToastMutation({
    mutationFn: instructorLessonApi.updateQuizContent,
    queryKeys: [
      [QueryKey.INSTRUCTOR_COURSE],
      [QueryKey.VALIDATE_COURSE],
      [QueryKey.INSTRUCTOR_QUIZ],
    ],
  })
}

export const useUpdateContentLesson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chapterId,
      id,
      data,
    }: {
      chapterId: number
      id: number
      data: UpdateTitleLessonPayload
    }) => instructorLessonApi.updateContentLesson(chapterId, id, data),
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_COURSE],
      })
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.VALIDATE_COURSE],
      })
      toast.success(res.message)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra')
    },
  })
}

export const useUpdateOrderLesson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      slug,
      lessons,
    }: {
      slug: string
      lessons: { id: number; order: number }[]
    }) => {
      return instructorLessonApi.updateOrderLesson(slug, { lessons })
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

export const useDeleteLesson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ chapterId, id }: { chapterId: number; id: number }) =>
      instructorLessonApi.deleteLesson(chapterId, id),
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

export const useUpdateCodingLesson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chapterSlug,
      codingId,
      data,
    }: {
      chapterSlug: string
      codingId: string | number
      data: Omit<UpdateCodingLessonPayload, 'hints'> & { hints?: string[] }
    }) => instructorLessonApi.updateCodingLesson(chapterSlug, codingId, data),
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_LESSON_CODING],
      })
      toast.success(res.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
