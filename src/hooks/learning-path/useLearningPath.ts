'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { learningPathApi } from '@/services/learning-path/learning-path-api'
import { useToastMutation } from '../use-toast-mutation'

export const useGetLessons = (course: string) => {
  return useQuery({
    queryKey: [QueryKey.LEARNING_PATH_LESSON, course],
    queryFn: () => learningPathApi.getLessons(course),
  })
}

export const useGetChapterFromLesson = (lessonId: number) => {
  return useQuery({
    queryKey: [QueryKey.NOTE_LESSON, lessonId],
    queryFn: () => learningPathApi.getChapterFromLesson(lessonId),
  })
}

export const useGetLessonDetail = (params: {
  courseSlug: string
  lessonId: number
}) => {
  return useQuery({
    queryKey: [
      QueryKey.LEARNING_PATH_LESSON,
      params.courseSlug,
      params.lessonId,
    ],
    queryFn: () => learningPathApi.getLessonDetail(params),
  })
}

export const usePrefetchLessonDetail = ({
  courseSlug,
  lessonId,
}: {
  courseSlug: string
  lessonId?: number
}) => {
  const queryClient = useQueryClient()

  const prefetch = () => {
    if (!lessonId) return

    queryClient.prefetchQuery({
      queryKey: [QueryKey.LEARNING_PATH_LESSON, courseSlug, lessonId],
      queryFn: () =>
        learningPathApi.getLessonDetail({
          courseSlug,
          lessonId,
        }),
    })
  }

  return { prefetch }
}

export const useGetQuizSubmission = (
  isCompleted: boolean,
  lessonId?: number,
  quizId?: number
) => {
  return useQuery({
    queryKey: [QueryKey.QUIZ_SUBMISSION, lessonId, quizId],
    queryFn: () => learningPathApi.getQuizSubmission(lessonId!, quizId!),
    enabled: isCompleted && !!lessonId && !!quizId,
  })
}

export const useGetCodeSubmission = (
  isCompleted: boolean,
  lessonId?: number,
  codingId?: number
) => {
  return useQuery({
    queryKey: [QueryKey.CODING_SUBMISSION, lessonId, codingId],
    queryFn: () => learningPathApi.getCodeSubmission(lessonId!, codingId!),
    enabled: isCompleted && !!lessonId && !!codingId,
  })
}

export const useCompleteLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: learningPathApi.completeLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.LEARNING_PATH_LESSON],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.COURSE_PROGRESS],
      })
    },
  })
}

export const useCompletePracticeExercise = () =>
  useToastMutation({
    mutationFn: learningPathApi.completePracticeExercise,
    queryKeys: [[QueryKey.LEARNING_PATH_LESSON], [QueryKey.COURSE_PROGRESS]],
  })

export const useUpdateLastTime = () => {
  return useMutation({
    mutationFn: learningPathApi.updateLastTime,
  })
}

export const useGetDraftCourse = (slug: string) => {
  return useQuery({
    queryKey: [QueryKey.DRAFT_COURSE, slug],
    queryFn: () => learningPathApi.getDraftCourse(slug),
  })
}
