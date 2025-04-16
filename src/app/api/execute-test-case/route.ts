import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { executeApi } from '@/services/execute-api'
import { executeTestCaseSchema } from '@/validations/execute'
import { getFunctionName, removeConsoleLogs } from './lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = executeTestCaseSchema.parse(body)

    const { testCase, ...rest } = parsed

    const cleanedCode = removeConsoleLogs(rest.files[0].content)
    const functionName = getFunctionName(cleanedCode)

    if (!functionName) {
      return NextResponse.json(
        { message: 'Không tìm thấy hàm hợp lệ trong mã nguồn' },
        { status: 400 }
      )
    }

    const logInputs = testCase
      .map((tc) => `console.log(${functionName}(...${tc.input}));`)
      .join('\n')

    const finalCode = `${cleanedCode}\n\n${logInputs}`

    const result = await executeApi.executeCode({
      ...rest,
      files: [
        {
          content: finalCode,
        },
      ],
    })

    const actualOutputs = result.run.stdout
      .split('\n')
      .filter((line) => line.trim() !== '')

    const testResults = testCase.map((tc, index) => {
      const input = JSON.parse(tc.input)
      const expected = JSON.parse(tc.output)
      let actual

      try {
        actual = JSON.parse(actualOutputs[index])
      } catch {
        actual = actualOutputs[index]
      }

      return {
        input: input?.flat(),
        expected,
        actual,
        passed: actual === expected,
      }
    })

    return NextResponse.json({
      message: 'Kết quả bài kiểm tra',
      data: {
        passed: testResults.every((result) => result.passed),
        testCase: testResults,
      },
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dữ liệu không hợp lệ', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: 'Máy chủ gặp sự cố, vui lòng thử lại sau',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
