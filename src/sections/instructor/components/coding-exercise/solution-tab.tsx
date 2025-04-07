'use client'

import { useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import MonacoEditor from '@/components/shared/monaco-editor'
import { Button } from '@/components/ui/button'
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
import { TestResult } from '@/lib/run-testcase'
import { UpdateCodingLessonPayload } from '@/validations/course'
import { ArrowUpDown, Info } from 'lucide-react'
import Link from 'next/link'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { ResultsViewer } from './results-viewer'

const SolutionTab = () => {
  const resultPanelRef = useRef<ImperativePanelHandle>(null)

  const [userCode, setUserCode] = useState<string>()
  const [executeResult, setExecuteResult] = useState('')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState<'test-results' | 'code-execution'>(
    'test-results'
  )

  const form = useFormContext<UpdateCodingLessonPayload>()

  const language = useWatch({ name: 'language' })
  const testCaseValue = useWatch({ name: 'test_case' })

  const { sampleFileName, version, codeSnippet, testCase } =
    LANGUAGE_CONFIG[language as Language]

  const files = {
    [sampleFileName]: {
      name: sampleFileName,
      language,
      value: codeSnippet,
      version,
    },
  }

  const testCaseFiles = {
    [sampleFileName.replace(/(\.[^.]+)$/, '.test$1')]: {
      name: sampleFileName.replace(/(\.[^.]+)$/, '.test$1'),
      language,
      value: testCase,
      version,
    },
  }

  useEffect(() => {
    setUserCode(codeSnippet)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={15}>
            <div className="flex h-full flex-col space-y-0 text-white">
              <div className="flex h-14 items-center gap-2 border-b border-gray-500 bg-[#0d0d0d] px-4 py-2">
                <span className="text-lg font-bold">Giải pháp</span>

                <Popover>
                  <PopoverTrigger asChild>
                    <button>
                      <Info className="size-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <p>
                      Các file giải pháp sẽ kiểm chứng file đánh giá đã cung cấp
                      (kiểm thử đơn vị) là đúng. Học viên phải viết ra file giải
                      pháp tương tự (không nhất thiết phải giống y hệt) theo
                      hướng dẫn được cung cấp ở bước &quot;Hướng dẫn&quot;.
                    </p>
                    <Button asChild className="mt-4" size="sm">
                      <Link href="#">Xem tài liệu</Link>
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="h-[calc(100%-3.5rem)]">
                <MonacoEditor
                  files={files}
                  value={userCode}
                  onChange={setUserCode}
                  onExecute={(value) => {
                    setExecuteResult(value)
                    setActiveTab('code-execution')
                    form.setValue('result_code', value)
                    form.trigger('result_code')
                    resultPanelRef.current?.resize(70)
                  }}
                  execute
                  testCase={testCaseValue}
                  onRunTest={(value) => {
                    setTestResults((prev) => {
                      if (prev.length === 0) return value

                      return value.splice(
                        value.length - prev.length,
                        prev.length
                      )
                    })
                    setActiveTab('test-results')
                    resultPanelRef.current?.resize(70)
                  }}
                />
              </div>
            </div>
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
                      Đánh giá
                    </FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <button>
                          <Info className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <p>
                          File đánh giá kiểm tra xem giải pháp của học viên có
                          đúng hay không. Cung cấp nhiều trường hợp kiểm tra,
                          tên kiểm tra mô tả và thông báo xác nhận giúp học viên
                          khắc phục sự cố và cải thiện giải pháp của họ.
                        </p>
                        <Button asChild className="mt-4" size="sm">
                          <Link href="#">Xem tài liệu</Link>
                        </Button>
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

            {form.formState.errors.result_code && (
              <p className="text-destructive">
                {form.formState.errors.result_code.message}
              </p>
            )}

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
