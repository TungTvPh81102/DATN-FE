import axios from 'axios'

import { ExecuteCodeResponse, ExecuteTestCaseResponse } from '@/types/execute'
import {
  ExecuteCodeRequest,
  ExecuteTestCaseRequest,
} from '@/validations/execute'

export const executeApi = {
  executeCode: async (
    payload: ExecuteCodeRequest
  ): Promise<ExecuteCodeResponse> => {
    const endpoint = 'https://emkc.org/api/v2/piston/execute'

    const response = await axios.post(endpoint, payload)
    return response.data
  },

  executeTestCase: async (
    payload: ExecuteTestCaseRequest
  ): Promise<ExecuteTestCaseResponse['data']> => {
    const endpoint = '/api/execute-test-case'

    const response = await axios.post(endpoint, payload)
    return response.data.data
  },
}
