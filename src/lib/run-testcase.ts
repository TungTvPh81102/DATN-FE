// @ts-expect-error jest-lite types are not available
import { describe, expect, it, test, run } from 'jest-lite'

export type TestResult = {
  duration: number
  errors: string[]
  status: 'pass' | 'fail'
  testPath: string[]
}

let prevResult: TestResult[] = []

export const runTestCase = async (userCode: string, testCode: string) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const executeAll = new Function(
      'describe',
      'it',
      'expect',
      'test',
      `${userCode}\n${testCode}`
    )
    executeAll(describe, it, expect, test)

    const result = (await run()) as TestResult[]

    const newResult = result.slice(prevResult.length)
    prevResult = result

    return newResult
  } catch (error) {
    console.error('Error executing the code:', error)
  }
}
