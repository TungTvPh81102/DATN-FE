import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

import { CreatePostPayload, UpdatePostPayload } from '@/validations/post'
import QueryKey from '@/constants/query-key'
import { instructorPostApi } from '@/services/instructor/post/post-api'
import { useToastMutation } from '@/hooks/use-toast-mutation'

export const useGetPosts = () => {
  return useQuery({
    queryKey: [QueryKey.POSTS],
    queryFn: () => instructorPostApi.getPosts(),
  })
}

export const useGetPostBySlug = (slug?: string) => {
  return useQuery({
    queryKey: [QueryKey.POSTS, slug],
    queryFn: () => instructorPostApi.getPostBySlug(slug!),
    enabled: !!slug,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostPayload) => {
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]: [string, any]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File || value instanceof Blob) {
            formData.append(key, value)
          } else if (Array.isArray(value)) {
            value.forEach((v) => formData.append(`${key}[]`, String(v)))
          } else if (typeof value === 'object') {
            if (value instanceof Date) {
              formData.append(key, format(value, 'yyyy-MM-dd HH:mm:ss'))
            } else {
              formData.append(key, JSON.stringify(value))
            }
          } else if (key === 'published_at') {
            formData.append(key, format(new Date(value), 'yyyy-MM-dd HH:mm:ss'))
          } else {
            formData.append(key, String(value))
          }
        }
      })

      return instructorPostApi.createPost(formData as any)
    },
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.POSTS],
      })

      toast.success(res?.message || 'Bài viết đã được tạo thành công!')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdatePostPayload }) => {
      const formData = new FormData()
      formData.append('_method', 'PUT')

      Object.entries(data).forEach(([key, value]: [string, any]) => {
        if (value !== undefined && value !== null) {
          if (key === 'thumbnail') {
            if (value instanceof File || value instanceof Blob) {
              formData.append(key, value)
            } else {
              formData.append(key, value || '')
            }
          } else if (Array.isArray(value)) {
            value.forEach((v) => formData.append(`${key}[]`, String(v)))
          } else if (typeof value === 'object') {
            if (value instanceof Date) {
              formData.append(key, format(value, 'yyyy-MM-dd HH:mm:ss'))
            } else {
              formData.append(key, JSON.stringify(value))
            }
          } else if (key === 'published_at') {
            formData.append(key, format(new Date(value), 'yyyy-MM-dd HH:mm:ss'))
          } else {
            formData.append(key, String(value))
          }
        }
      })

      return instructorPostApi.updatePost(slug, formData as any)
    },
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.POSTS],
      })

      toast.success(res?.message || 'Bài viết đã được cập nhật thành công!')

      router.push('/instructor/posts')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useSendPostRequest = () => {
  return useToastMutation({
    mutationFn: instructorPostApi.sendPostRequest,
    queryKey: [QueryKey.POSTS],
  })
}
