import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { StoreQuestionPayload } from '@/validations/lesson'
import QueryKey from '@/constants/query-key'
import { instructorQuizApi } from '@/services/instructor/quiz/quiz-api'
import { useToastMutation } from '@/hooks/use-toast-mutation'
import { instructorCourseApi } from '@/services/instructor/course/course-api'

export const useGetQuiz = (id?: number) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_QUIZ, id],
    queryFn: () => instructorQuizApi.getQuiz(id!),
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
  return useToastMutation({
    mutationFn: instructorQuizApi.createQuestion,
    queryKeys: [[QueryKey.INSTRUCTOR_QUIZ], [QueryKey.VALIDATE_COURSE]],
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
  return useToastMutation({
    mutationFn: instructorQuizApi.deleteQuestion,
    queryKeys: [[QueryKey.INSTRUCTOR_QUIZ], [QueryKey.VALIDATE_COURSE]],
  })
}

export const useImportQuestion = () => {
  return useToastMutation({
    mutationFn: instructorQuizApi.importQuestion,
    queryKeys: [[QueryKey.INSTRUCTOR_QUIZ], [QueryKey.VALIDATE_COURSE]],
  })
}

export const useUpdateQuestionsOrder = () => {
  return useToastMutation({
    mutationFn: instructorQuizApi.updateQuestionsOrder,
    queryKey: [QueryKey.INSTRUCTOR_QUIZ],
  })
}

export const useExportQuiz = () => {
  return useMutation({
    mutationFn: instructorCourseApi.exportQuiz,
    onSuccess: (data: any) => {
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'quiz_export.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}
