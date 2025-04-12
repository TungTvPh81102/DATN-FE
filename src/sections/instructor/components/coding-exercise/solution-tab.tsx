'use client'

import { ArrowUpDown, Info, Trash } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { ImperativePanelHandle } from 'react-resizable-panels'

import MonacoEditor from '@/components/shared/monaco-editor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
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
import { ExecuteTestCaseResponse } from '@/types/execute'
import { UpdateCodingLessonPayload } from '@/validations/course'

import { ResultsViewer } from './results-viewer'

const SolutionTab = () => {
  const resultPanelRef = useRef<ImperativePanelHandle>(null)

  const [userCode, setUserCode] = useState<string>()
  const [executeResult, setExecuteResult] = useState('')
  const [testResults, setTestResults] = useState<
    ExecuteTestCaseResponse['data']
  >({
    passed: false,
    testCase: [],
  })
  const [activeTab, setActiveTab] = useState<'test-results' | 'code-execution'>(
    'code-execution'
  )

  const form = useFormContext<UpdateCodingLessonPayload>()

  const { fields, append, remove } = useFieldArray({
    name: 'test_case',
    control: form.control,
  })

  const language = useWatch({ name: 'language' })
  const ignoreTestCase = useWatch({ name: 'ignore_test_case' })
  const testCase = useWatch({ name: 'test_case' })

  const { sampleFileName, version, codeSnippet } =
    LANGUAGE_CONFIG[language as Language]

  const files = {
    [sampleFileName]: {
      name: sampleFileName,
      language,
      value: codeSnippet,
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

                    resultPanelRef.current?.resize(70)
                  }}
                  execute
                  testCase={!ignoreTestCase ? testCase : undefined}
                  onRunTest={(value) => {
                    setTestResults(value)
                    setActiveTab('test-results')

                    form.setValue('checkTestCase', value.passed)
                    form.trigger('test_case')

                    resultPanelRef.current?.resize(70)
                  }}
                />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel minSize={15}>
            <div className="flex h-full flex-col">
              <div className="flex h-14 items-center gap-2 border-b px-4 py-2">
                <Label className="text-lg font-bold">Kiểm thử</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <button>
                      <Info className="size-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="space-y-2">
                    <p>
                      Cung cấp nhiều trường hợp kiểm tra, tên kiểm tra mô tả và
                      thông báo xác nhận giúp học viên khắc phục sự cố và cải
                      thiện giải pháp của họ.
                    </p>
                    <p className="text-sm italic text-muted-foreground">
                      <span className="text-destructive">*</span> Có thể truyền
                      nhiều tham số bằng cách sử dụng dấu phẩy
                    </p>
                  </PopoverContent>
                </Popover>

                {(() => {
                  const error =
                    form.getFieldState('test_case').error?.message ||
                    form.getFieldState('test_case').error?.root?.message

                  if (!error || ignoreTestCase) return null

                  return <p className="text-sm text-destructive">{error}</p>
                })()}
              </div>
              <div className="h-[calc(100%-3.5rem)] space-y-4 overflow-y-auto px-3 py-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="gap-4 md:flex">
                    <FormField
                      control={form.control}
                      name={`test_case.${index}.input`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <FloatingLabelInput
                              label="Đầu vào"
                              className="min-h-16"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`test_case.${index}.output`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <FloatingLabelInput
                              label="Đầu ra"
                              className="min-h-16"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex h-16 items-center">
                      <Button
                        className="rounded-full text-destructive hover:text-destructive"
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          remove(index)
                        }}
                        disabled={fields.length <= 2 || form.formState.disabled}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                ))}

                <FormField
                  control={form.control}
                  name="ignore_test_case"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormLabel>Bỏ qua kiểm thử</FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  onClick={() => append({ input: '', output: '' })}
                  disabled={
                    fields.length >= 5 ||
                    form.formState.disabled ||
                    ignoreTestCase
                  }
                >
                  Thêm trường hợp
                </Button>
              </div>
            </div>
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
              testResults={testResults.testCase}
            />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
export default SolutionTab
