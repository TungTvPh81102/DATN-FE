export interface ExecuteCodeResponse {
  run: Run
  language: string
  version: string
}

interface Run {
  stdout: string
  stderr: string
  code: number
  signal: null
  output: string
}

export interface ExecuteTestCaseResponse {
  message: string
  data: Data
}

interface Data {
  passed: boolean
  testCase: TestCase[]
}

interface TestCase {
  input: number[]
  expected: number
  actual: string
  passed: boolean
}
