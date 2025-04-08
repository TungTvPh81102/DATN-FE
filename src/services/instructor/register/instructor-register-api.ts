import api from '@/configs/api'
import { RegisterInstructorPayload } from '@/validations/instructor'

const prefix = '/instructor/register'

export const instructorRegisterApi = {
  register: (payload: RegisterInstructorPayload) => {
    const formData = new FormData()

    const { qa_systems, certificates, identity_verification } = payload

    qa_systems.forEach((item, index) => {
      Object.entries(item).forEach(([fieldKey, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val, subIndex) => {
            formData.append(
              `qa_systems[${index}][${fieldKey}][${subIndex}]`,
              val + ''
            )
          })
        } else {
          formData.append(`qa_systems[${index}][${fieldKey}]`, value + '')
        }
      })
    })

    if (certificates) {
      certificates.forEach((certificate, index) => {
        if (certificate.file)
          formData.append(`certificates[${index}]`, certificate.file)
      })
    }

    if (identity_verification) {
      formData.append('identity_verification', identity_verification)
    }

    return api.post(prefix, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
