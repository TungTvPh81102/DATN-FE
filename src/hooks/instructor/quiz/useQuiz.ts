import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { StoreQuestionPayload } from '@/validations/lesson'
import QueryKey from '@/constants/query-key'
import { instructorQuizApi } from '@/services/instructor/quiz/quiz-api'

export const useGetQuiz = (id: string) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_QUIZ, id],
    queryFn: () => instructorQuizApi.getQuiz(id),
    enabled: !!id,
  })
}

export const useGetQuestion = (id?: string) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_QUESTION, id],
    queryFn: () => instructorQuizApi.getQuestion(id!),
    enabled: !!id,
  })
}

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      quizId,
      payload,
    }: {
      quizId: string
      payload: StoreQuestionPayload
    }) => instructorQuizApi.createQuestion(quizId, payload),
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_QUIZ],
      })
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_QUESTION],
      })
      toast.success(res.message)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      questionId,
      payload,
    }: {
      questionId: string
      payload: StoreQuestionPayload
    }) => {
      return instructorQuizApi.updateQuestion(questionId, payload)
    },
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_QUESTION, res?.data.id],
      })
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_QUIZ, res?.data.quiz_id],
      })
      toast.success(res.message)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (questionId: string) =>
      instructorQuizApi.deleteQuestion(questionId),
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_QUIZ],
      })
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_QUESTION],
      })
      toast.success(res.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useImportQuestion = () => {
  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: FormData }) =>
      instructorQuizApi.importQuestion(quizId, data),
    onSuccess: (res: any) => {
      toast.success(res.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
