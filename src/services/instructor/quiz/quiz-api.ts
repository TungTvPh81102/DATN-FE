import { StoreQuestionPayload } from '@/validations/lesson'
import api from '@/configs/api'
import { GetQuizResponse } from '@/types'

const prefix = 'instructor/manage/lessons/quiz'

export const instructorQuizApi = {
  downloadQuizForm: async () => {
    return await api.get(`${prefix}/download-quiz-form`)
  },
  getQuiz: async (quizId: number): Promise<GetQuizResponse> => {
    const res = await api.get(`${prefix}/${quizId}/show-quiz`)
    return res.data
  },
  getQuestion: async (questionId: string): Promise<any> => {
    const res = await api.get(`${prefix}/${questionId}/show-quiz-question`)
    return res.data
  },
  createQuestion: ({
    quizId,
    payload,
  }: {
    quizId: number
    payload: StoreQuestionPayload
  }) => {
    return api.post(`${prefix}/${quizId}/store-quiz-question-single`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  importQuestion: ({
    quizId,
    payload,
  }: {
    quizId: string
    payload: { file: File; type: 'overwrite' | 'add' }
  }) => {
    return api.post(`${prefix}/${quizId}/import-quiz-question`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  updateQuestion: async (questionId: string, data: StoreQuestionPayload) => {
    return await api.post(
      `${prefix}/${questionId}/update-quiz-question`,
      {
        ...data,
        _method: 'PUT',
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },
  deleteQuestion: async (questionId: number) => {
    return await api.delete(`${prefix}/${questionId}/delete-quiz-question`)
  },
  updateQuestionsOrder: async ({
    quizId,
    payload,
  }: {
    quizId: string
    payload: { id: number; order: number }[]
  }) => {
    return await api.put(`${prefix}/${quizId}/update-order`, payload)
  },
}
