'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Language, LANGUAGE_CONFIG } from '@/constants/language'
import {
  useCompleteLesson,
  useGetCodeSubmission,
} from '@/hooks/learning-path/useLearningPath'
import { formatDate } from '@/lib/common'
import { ILesson } from '@/types'
import {
  CodeSubmissionPayLoad,
  codeSubmissionSchema,
} from '@/validations/code-submission'

import HtmlRenderer from '@/components/shared/html-renderer'
import MonacoEditor from '@/components/shared/monaco-editor'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Props = {
  lesson: ILesson
  isCompleted: boolean
}

const CodingLesson = ({ lesson, isCompleted }: Props) => {
  const { lessonable: codeData } = lesson

  const { data: codeSubmission } = useGetCodeSubmission(
    isCompleted,
    lesson.id,
    codeData?.id
  )

  const form = useForm<CodeSubmissionPayLoad>({
    resolver: zodResolver(codeSubmissionSchema),
    defaultValues: {
      code: codeData?.sample_code,
    },
    values: codeSubmission?.code
      ? { code: codeSubmission.code, result: '' }
      : undefined,
  })

  const { mutate: completeLesson, isPending } = useCompleteLesson()

  const language = codeData?.language as Language

  const { sampleFileName, version } = LANGUAGE_CONFIG[language]

  const files = {
    [sampleFileName]: {
      name: sampleFileName,
      language,
      value: codeData?.sample_code || '',
      version,
    },
  }

  const onSubmit = (values: CodeSubmissionPayLoad) => {
    completeLesson({
      lessonId: lesson.id,
      payload: values,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative h-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={30}>
            <Tabs defaultValue="instruct" className="flex h-full flex-col">
              <TabsList variant="outline" className="h-12 px-8">
                <TabsTrigger
                  value="instruct"
                  variant="outline"
                  className="h-12 min-w-32 border-b-2 text-base duration-500 data-[state=active]:text-primary data-[state=active]:focus:bg-primary/5"
                >
                  NỘI DUNG
                </TabsTrigger>
                <TabsTrigger
                  value="hints"
                  variant="outline"
                  className="h-12 min-w-32 border-b-2 text-base duration-500 data-[state=active]:text-primary data-[state=active]:focus:bg-primary/5"
                >
                  GỢI Ý
                </TabsTrigger>
              </TabsList>
              <div className="h-full overflow-y-auto p-8 pb-20 scrollbar-thin lg:px-16">
                <TabsContent value="instruct">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold">{lesson.title}</h1>
                    <p className="text-sm text-muted-foreground">
                      Cập nhật{' '}
                      {formatDate(lesson.updated_at, {
                        dateStyle: 'long',
                      })}
                    </p>
                  </div>

                  <HtmlRenderer html={lesson.content} className="mt-8" />
                  <HtmlRenderer html={codeData?.instruct} className="mt-8" />
                </TabsContent>
                <TabsContent value="hints" className="prose">
                  <ol>
                    {codeData?.hints?.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ol>
                </TabsContent>
              </div>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle />

          <ResizablePanel minSize={20}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel minSize={30} defaultSize={92}>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="h-full text-white">
                      <FormControl>
                        <MonacoEditor
                          files={files}
                          onExecute={(code) => {
                            form.setValue('result', code)
                            form.trigger('result')
                          }}
                          readOnly={field.disabled}
                          activeFileGroup={'solution'}
                          runCode
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </ResizablePanel>
              <ResizableHandle />

              <ResizablePanel minSize={8}>
                <FormField
                  control={form.control}
                  name="result"
                  render={({ field }) => (
                    <FormItem className="flex h-full flex-col space-y-0 text-white">
                      <FormLabel className="flex h-14 items-center gap-2 border-b border-gray-500 bg-[#0d0d0d] px-4 py-2 text-lg font-bold">
                        Kết quả
                        <FormMessage />
                      </FormLabel>

                      <div className="flex-1 bg-[#1e1e1e] px-6 py-4">
                        {field.value}
                      </div>
                    </FormItem>
                  )}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>

        {!isCompleted && (
          <Button
            type="submit"
            className="absolute bottom-5 right-5"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Nộp bài
          </Button>
        )}
      </form>
    </Form>
  )
}

export default CodingLesson
