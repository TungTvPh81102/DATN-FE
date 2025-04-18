import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import QueryKey from '@/constants/query-key'
import { useToastMutation } from '@/hooks/use-toast-mutation'
import {
  GetCoursesParams,
  instructorCourseApi,
} from '@/services/instructor/course/course-api'
import {
  RequestModifyContentPayload,
  UpdateCourseObjectivePayload,
} from '@/validations/course'

export const useGetCourses = (params?: GetCoursesParams) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_COURSE, params],
    queryFn: () => instructorCourseApi.getCourses(params),
  })
}

export const useGetCoursesWithPrice = () => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_COURSE],
    queryFn: () => instructorCourseApi.getCoursesWithPrice(),
  })
}

export const useGetCourseOverview = (slug?: string) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_COURSE, slug],
    queryFn: () => instructorCourseApi.getCourseOverview(slug!),
    enabled: !!slug,
  })
}

export const useGetApprovedCourses = () => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_COURSE_APPROVED],
    queryFn: instructorCourseApi.getApprovedCourses,
  })
}

export const useGetCourseListOfUser = (slug?: string) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_COURSE, slug],
    queryFn: () => instructorCourseApi.courseListOfUser(slug!),
    enabled: !!slug,
  })
}

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: instructorCourseApi.createCourse,
    onError: (error) => toast.error(error.message),
  })
}

export const useUpdateCourseObjective = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      slug,
      data,
    }: {
      slug: string
      data: UpdateCourseObjectivePayload
    }) => instructorCourseApi.updateCourseObjective(slug, data),
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

// export const useUpdateCourseOverView = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: ({
//       slug,
//       data,
//     }: {
//       slug: string
//       data: UpdateCourseOverViewPayload
//     }) => {
//       const formData = new FormData()
//       formData.append('_method', 'PUT')

//       const appendFormData = (
//         formData: FormData,
//         data: Record<string, any>
//       ) => {
//         Object.entries(data).forEach(([key, value]) => {
//           if (value === undefined || value === null) return

//           if (value instanceof File) {
//             formData.append(key, value)
//           } else if (Array.isArray(value)) {
//             value.forEach((item, index) => {
//               appendFormData(formData, { [`${key}[${index}]`]: item })
//             })
//           } else if (typeof value === 'object' && !(value instanceof File)) {
//             appendFormData(formData, value)
//           } else {
//             formData.append(key, String(value))
//           }
//         })
//       }

//       if (data.thumbnail instanceof File) {
//         formData.append('thumbnail', data.thumbnail)
//       }

//       if (data.intro === null) {
//         formData.append('intro', '')
//       } else if (data.intro instanceof File) {
//         formData.append('intro', data.intro)
//       } else if (typeof data.intro === 'string') {
//         formData.append('intro', data.intro)
//       }

//       formData.append('is_free', data.is_free === '1' ? '1' : '0')

//       if (data.is_free === '1') {
//         formData.append('price', '0')
//         formData.append('price_sale', '0')
//       } else {
//         if (data.price !== undefined) {
//           formData.append('price', String(data.price))
//         }
//         if (data.price_sale !== undefined) {
//           formData.append('price_sale', String(data.price_sale))
//         }
//       }

//       appendFormData(formData, {
//         category_id: data.category_id,
//         name: data.name,
//         description: data.description,
//         level: data.level,
//         visibility: data.visibility,
//       })

//       return instructorCourseApi.updateCourseOverView(slug, formData)
//     },
//     onSuccess: async (res: any) => {
//       await Promise.all([
//         queryClient.invalidateQueries({
//           queryKey: [QueryKey.INSTRUCTOR_COURSE],
//         }),
//         queryClient.invalidateQueries({
//           queryKey: [QueryKey.VALIDATE_COURSE],
//         }),
//       ])

//       toast.success(res.message)
//     },
//     onError: (error) => {
//       toast.error(error.message)
//     },
//   })
// }

export const useUpdateCourseOverView = () =>
  useToastMutation({
    mutationFn: instructorCourseApi.updateCourseOverView,
    queryKeys: [[QueryKey.INSTRUCTOR_COURSE], [QueryKey.VALIDATE_COURSE]],
  })

export const useValidateCourse = (slug?: string) => {
  return useQuery({
    queryKey: [QueryKey.VALIDATE_COURSE, slug],
    queryFn: () => instructorCourseApi.validateCourse(slug!),
    enabled: !!slug,
  })
}

export const useSubmitCourse = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (slug?: string) => instructorCourseApi.submitCourse(slug!),
    onSuccess: async (res: any) => {
      router.replace('/instructor/courses')
      toast.success(res.message)
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_COURSE],
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useRequestModifyContent = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: RequestModifyContentPayload) =>
      instructorCourseApi.requestModifyContent(data),
    onSuccess: async (res: any) => {
      router.replace('/instructor/courses')
      toast.success(res.message)
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_COURSE],
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useGetCoursesFromTrash = () => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_COURSE_TRASH],
    queryFn: () => instructorCourseApi.getCoursesFormTrash(),
  })
}

export const useMoveCoursesToTrash = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: instructorCourseApi.moveCoursesToTrash,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_COURSE],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_COURSE_TRASH],
      })
      toast.success(data.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export const useRestoreCourses = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: instructorCourseApi.restoreCourses,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_COURSE],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_COURSE_TRASH],
      })
      toast.success(data.message)
    },
    onError: (error) => toast.error(error.message),
  })
}
