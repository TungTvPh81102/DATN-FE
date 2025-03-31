import api from '@/configs/api'

const prefix = 'upload'

export const uploadApi = {
  uploadImage: async (
    image: File
  ): Promise<{
    message: string
    data: string
  }> => {
    return await api.post(
      `${prefix}/image`,
      { image },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },
}
