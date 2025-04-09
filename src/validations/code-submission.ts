import { z } from 'zod'

export const codeSubmissionSchema = z.object({
  code: z.string(),
})

export type CodeSubmissionPayLoad = z.infer<typeof codeSubmissionSchema>
