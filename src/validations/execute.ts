import { z } from 'zod'

export const fileSchema = z.object({
  name: z.string().optional(),
  content: z.string(),
  encoding: z.enum(['base64', 'hex', 'utf-8']).optional(),
})

export const ExecuteCodeRequestSchema = z.object({
  language: z.string(),
  version: z.string(),
  files: z.array(fileSchema),
  stdin: z.string().optional(),
  args: z.array(z.string()).optional(),
  run_timeout: z.number().optional(),
  compile_timeout: z.number().optional(),
  compile_memory_limit: z.number().optional(),
  run_memory_limit: z.number().optional(),
})

export type ExecuteCodeRequest = z.infer<typeof ExecuteCodeRequestSchema>

export const testCaseSchema = z.array(
  z.object({
    input: z.string().trim().min(1, 'Vui lòng nhập đầu vào'),
    output: z.string().trim().min(1, 'Vui lòng nhập đầu ra'),
  })
)

export type TestCase = z.infer<typeof testCaseSchema>

export const executeTestCaseSchema = ExecuteCodeRequestSchema.extend({
  testCase: testCaseSchema,
})

export type ExecuteTestCaseRequest = z.infer<typeof executeTestCaseSchema>
