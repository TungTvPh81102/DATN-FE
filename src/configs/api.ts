import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

import StorageKey from '@/constants/storage-key'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://datn-be.test/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = Cookies.get(StorageKey.ACCESS_TOKEN)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401: {
          console.log('Unauthorized', data)
          break
        }
        case 403: {
          console.error('Forbidden', data)
          break
        }
        case 404: {
          console.log('Not Found', data)
          break
        }
        case 422: {
          console.log('Unprocessable Entity', data)
          break
        }
        case 500: {
          console.log('Internal Server Error', data)
          break
        }
        default: {
          console.log('Error', data)
          break
        }
      }

      if (!!data)
        return Promise.reject({
          status,
          ...data,
        })
    } else if (error.request) {
      toast.error('No response received from the server')
    } else {
      console.log('Network Error')
      toast.error('Error: ' + error.message)
    }

    return Promise.reject(error)
  }
)

export default api
