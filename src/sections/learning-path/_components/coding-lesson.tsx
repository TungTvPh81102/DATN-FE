'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImperativePanelHandle } from 'react-resizable-panels'

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
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TestResult } from '@/lib/run-testcase'
import { ResultsViewer } from '@/sections/instructor/components/coding-exercise/results-viewer'

type Props = {
  lesson: ILesson
  isCompleted: boolean
}

const CodingLesson = ({ lesson, isCompleted }: Props) => {
  const { lessonable: codeData } = lesson

  const resultPanelRef = useRef<ImperativePanelHandle>(null)
  const [executeResult, setExecuteResult] = useState('')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState<'test-results' | 'code-execution'>(
    'code-execution'
  )

  const isPass = useMemo(() => {
    if (!codeData?.test_case) return true

    if (testResults.length === 0) return false

    return testResults.every((result) => result.status === 'pass')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testResults])

  const { data: codeSubmission } = useGetCodeSubmission(
    isCompleted,
    lesson.id,
    codeData?.id
  )

  const form = useForm<CodeSubmissionPayLoad>({
    resolver: zodResolver(codeSubmissionSchema),
    defaultValues: {
      code: codeData?.student_code,
    },
  })

  const { mutate: completeLesson, isPending } = useCompleteLesson()

  const language = codeData?.language as Language

  const { fileName, version } = LANGUAGE_CONFIG[language]

  const files = {
    [fileName]: {
      name: fileName,
      language,
      value: codeData?.student_code || '',
      version,
    },
  }

  const onSubmit = (values: CodeSubmissionPayLoad) => {
    completeLesson({
      lessonId: lesson.id,
      payload: values,
    })
  }

  useEffect(() => {
    if (codeSubmission) {
      form.reset({
        code: codeSubmission.code,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeSubmission])

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
                  className="h-12 basis-1/2 border-b-2 text-base duration-500 data-[state=active]:text-primary data-[state=active]:focus:bg-primary/5"
                >
                  NỘI DUNG
                </TabsTrigger>
                <TabsTrigger
                  value="hints"
                  variant="outline"
                  className="h-12 basis-1/2 border-b-2 text-base duration-500 data-[state=active]:text-primary data-[state=active]:focus:bg-primary/5"
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
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { ref, ...field } }) => (
                    <FormItem className="h-full text-white">
                      <FormControl>
                        <MonacoEditor
                          files={files}
                          readOnly={field.disabled}
                          {...field}
                          onExecute={(value) => {
                            setExecuteResult(value)
                            setActiveTab('code-execution')

                            resultPanelRef.current?.resize(70)
                          }}
                          execute
                          testCase={codeData?.test_case}
                          onRunTest={(value) => {
                            setTestResults(value)
                            setActiveTab('test-results')
                            resultPanelRef.current?.resize(70)
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </ResizablePanel>
              <ResizableHandle />

              <ResizablePanel
                ref={resultPanelRef}
                minSize={8}
                defaultSize={8}
                maxSize={70}
                collapsedSize={8}
                collapsible
              >
                <div className="flex h-full flex-col space-y-0 text-white">
                  <div
                    className="flex h-14 cursor-pointer items-center justify-between gap-2 border-b border-gray-500 bg-[#0d0d0d] px-4 py-2 text-lg font-bold hover:bg-[#0d0d0d]/95"
                    onClick={() => {
                      if (!resultPanelRef.current) return

                      if (resultPanelRef.current?.getSize() >= 35) {
                        resultPanelRef.current?.resize(7)
                      } else {
                        resultPanelRef.current?.resize(70)
                      }
                    }}
                  >
                    <span>Kết quả</span>

                    <ArrowUpDown className="size-4" />
                  </div>

                  <div className="flex h-[calc(100%-3.5rem)] bg-[#1e1e1e]">
                    <ResultsViewer
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      executeResult={executeResult}
                      testResults={testResults}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>

        {!isCompleted && isPass && (
          <LoadingButton
            type="submit"
            className="absolute bottom-5 right-5"
            loading={isPending}
          >
            Nộp bài
          </LoadingButton>
        )}
      </form>
    </Form>
  )
}

export default CodingLesson
