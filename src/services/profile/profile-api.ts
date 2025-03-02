import {
  ProfileBioFormValues,
  UpdateCareerProfilePayload,
  UpdateCertificatesProfilePayload,
  UpdateProfilePayload,
} from '@/validations/profile'
import api from '@/configs/api'

const prefix = '/users/profile'

export const profileApi = {
  getProfile: async () => {
    return await api.get(`${prefix}`)
  },

  updateProfile: async (data: UpdateProfilePayload) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'avatar' && value instanceof File) {
        formData.append('avatar', value)
      } else if (typeof value === 'string' || typeof value === 'number') {
        formData.append(key, value.toString())
      }
    })

    formData.append('_method', 'PUT')

    return await api.post(prefix, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  updateBioProfile: async (data: ProfileBioFormValues) => {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(`bio[${key}]`, value)
      }
    })

    formData.append('_method', 'PUT')

    return await api.post(prefix, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  updateCertificatesProfile: async (data: UpdateCertificatesProfilePayload) => {
    const formData = new FormData()

    if (data.certificates && data.certificates.length > 0) {
      data.certificates.forEach((file, index) => {
        formData.append(`certificates[${index}]`, file)
      })
    }
    formData.append('_method', 'PUT')
    return await api.post(prefix, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  createCareer: async (data: UpdateCareerProfilePayload) => {
    const formData = new FormData()
    const career = data.careers
    console.log('data updateCareer', data)
    if (career) {
      Object.entries(career).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`careers[0][${key}]`, value.toString())
        }
      })
    }
    return await api.post(`/users/careers`, formData)
  },

  updateCareer: async (data: UpdateCareerProfilePayload, careerId: string) => {
    const formData = new FormData()
    const career = data.careers
    console.log('data updateCareer', data)
    if (career) {
      Object.entries(career).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`careers[0][${key}]`, value.toString())
        }
      })
    }

    formData.append('_method', 'PUT')
    return await api.post(`/users/careers/${careerId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  deleteCareer: async (careerId: string) => {
    const formData = new FormData()

    formData.append('_method', 'DELETE')
    return await api.post(`/users/careers/${careerId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
