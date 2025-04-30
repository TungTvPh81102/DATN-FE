'use client'

import { ArrowUpDown, Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { ImperativePanelHandle } from 'react-resizable-panels'

import MonacoEditor from '@/components/shared/monaco-editor'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Language, LANGUAGE_CONFIG } from '@/constants/language'
import { UpdateCodingLessonPayload } from '@/validations/course'

import { TestResult } from '@/lib/run-testcase'
import { ResultsViewer } from './results-viewer'

const SolutionTab = () => {
  const resultPanelRef = useRef<ImperativePanelHandle>(null)

  const [executeResult, setExecuteResult] = useState('')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState<'test-results' | 'code-execution'>(
    'code-execution'
  )

  const form = useFormContext<UpdateCodingLessonPayload>()

  const language = useWatch({ name: 'language' })
  const code = useWatch({ name: 'code' })
  const testCase = useWatch({ name: 'test_case' })

  const { fileName, version } = LANGUAGE_CONFIG[language as Language]

  const files = {
    [fileName]: {
      name: fileName,
      language,
      value: code,
      version,
    },
  }

  const testCaseFiles = {
    [fileName.replace(/(\.[^.]+)$/, '.test$1')]: {
      name: fileName.replace(/(\.[^.]+)$/, '.test$1'),
      language,
      value: testCase,
      version,
    },
  }

  useEffect(() => {
    if (form.getValues('checkTestCase')) {
      form.setValue('checkTestCase', undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, testCase])

  useEffect(() => {
    form.setValue(
      'checkTestCase',
      testResults.every((result) => result.status === 'pass')
    )

    form.trigger('test_case')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testResults])

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={15}>
            <FormField
              control={form.control}
              name="code"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { ref, ...field } }) => (
                <FormItem className="flex h-full flex-col space-y-0 text-white">
                  <div className="flex h-14 items-center gap-2 border-b border-gray-500 bg-[#0d0d0d] px-4 py-2">
                    <FormLabel className="text-lg font-bold">
                      Kiểm thử
                    </FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <button>
                          <Info className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <p>
                          Các file giải pháp sẽ kiểm chứng file đánh giá đã cung
                          cấp (kiểm thử đơn vị) là đúng. Học viên phải viết ra
                          file giải pháp tương tự (không nhất thiết phải giống y
                          hệt) theo hướng dẫn được cung cấp ở bước &quot;Hướng
                          dẫn&quot;.
                        </p>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </div>
                  <div className="h-[calc(100%-3.5rem)]">
                    <MonacoEditor
                      files={files}
                      onExecute={(value) => {
                        setExecuteResult(value)
                        setActiveTab('code-execution')

                        resultPanelRef.current?.resize(70)
                      }}
                      execute
                      testCase={testCase}
                      onRunTest={(value) => {
                        setTestResults(value)
                        setActiveTab('test-results')

                        resultPanelRef.current?.resize(70)
                      }}
                      {...field}
                    />
                  </div>
                </FormItem>
              )}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel minSize={15}>
            <FormField
              control={form.control}
              name="test_case"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { ref, ...field } }) => (
                <FormItem className="flex h-full flex-col space-y-0 text-white">
                  <div className="flex h-14 items-center gap-2 border-b border-gray-500 bg-[#0d0d0d] px-4 py-2">
                    <FormLabel className="text-lg font-bold">
                      Kiểm thử
                    </FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <button>
                          <Info className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="space-y-2">
                        <p>
                          Cung cấp nhiều trường hợp kiểm tra, tên kiểm tra mô tả
                          và thông báo xác nhận giúp học viên khắc phục sự cố và
                          cải thiện giải pháp của họ.
                        </p>
                        <p className="text-sm italic text-muted-foreground">
                          <span className="text-destructive">*</span> Có thể
                          truyền nhiều tham số bằng cách sử dụng dấu phẩy
                        </p>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </div>

                  <div className="h-[calc(100%-3.5rem)]">
                    <MonacoEditor
                      files={testCaseFiles}
                      readOnly={field.disabled}
                      {...field}
                    />
                  </div>
                </FormItem>
              )}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle />
      <ResizablePanel
        ref={resultPanelRef}
        minSize={7}
        defaultSize={7}
        maxSize={70}
        collapsedSize={7}
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
  )
}
export default SolutionTab
