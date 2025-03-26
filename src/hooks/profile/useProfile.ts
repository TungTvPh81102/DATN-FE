import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import QueryKey from '@/constants/query-key'
import { profileApi } from '@/services/profile/profile-api'
import {
  ProfileBioFormValues,
  UpdateCareerProfilePayload,
  UpdateCertificatesProfilePayload,
  UpdateProfilePayload,
} from '@/validations/profile'
import { setLocalStorage } from '@/lib/common'

export const useGetProfile = () => {
  return useQuery({
    queryKey: [QueryKey.PROFILE],
    queryFn: () => profileApi.getProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => profileApi.updateProfile(data),
    onSuccess: async (res: any) => {
      const successMessage = res?.message
      toast.success(successMessage)

      const { user } = res?.data || {}
      if (user.profile.about_me && user.profile.phone && user.profile.address) {
        setLocalStorage('checkProfile', 'true')
      } else {
        setLocalStorage('checkProfile', 'false')
      }

      await queryClient.invalidateQueries({
        queryKey: [QueryKey.PROFILE],
      })
    },
    onError: (error) => {
      toast.error(error?.message)
    },
  })
}

export const useUpdateBioProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ProfileBioFormValues) =>
      profileApi.updateBioProfile(data),

    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] })
      toast.success(res?.message)
    },
    onError: (error) => {
      toast.error(error?.message)
    },
  })
}

export const useUpdateCertificatesProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateCertificatesProfilePayload) =>
      profileApi.updateCertificatesProfile(data),

    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] })
      toast.success(res?.message)
    },
    onError: (error) => {
      toast.error(error?.message)
    },
  })
}

export const useCreatCareers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateCareerProfilePayload) =>
      profileApi.createCareer(data),
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] })
      toast.success(res?.message)
    },
    onError: (error) => {
      toast.error(error?.message)
    },
  })
}

export const useUpdateCareers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      data,
      careerId,
    }: {
      data: UpdateCareerProfilePayload
      careerId: string
    }) => profileApi.updateCareer(data, careerId),
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] })
      toast.success(res?.message)
    },
    onError: (error) => {
      toast.error(error?.message)
    },
  })
}

export const useDeleteCareer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (careerId: string) => profileApi.deleteCareer(careerId),

    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] })
      toast.success(res?.message)
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra!')
    },
  })
}
