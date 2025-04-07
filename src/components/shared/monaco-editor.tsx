'use client'

import { CirclePlay, Loader2, RotateCcw } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import { useExecuteCode } from '@/hooks/use-execute-code'
import { cn } from '@/lib/utils'

import { runTestCase, TestResult } from '@/lib/run-testcase'
import { toast } from 'react-toastify'
import { Button } from '../ui/button'
import { LoadingButton } from '../ui/loading-button'

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
})

type File = {
  name: string
  language: string
  value: string
  version: string
}

type Props = {
  files: { [key: string]: File }
  value?: string
  onChange?: (value?: string, fileName?: string) => void
  execute?: boolean
  onExecute?: (result: string) => void
  testCase?: string
  onRunTest?: (result: TestResult[]) => void
  theme?: 'light' | 'vs-dark'
  disabled?: boolean
  readOnly?: boolean
  [key: string]: any
}

const MonacoEditor = ({
  files,
  value,
  onChange,
  execute = false,
  onExecute,
  testCase,
  onRunTest,
  theme = 'vs-dark',
  disabled,
  readOnly,
  ...rest
}: Props) => {
  const firstFileName = Object.keys(files)[0]
  const { mutate: executeCode, isPending } = useExecuteCode()

  const [fileName, setFileName] = useState<string>(firstFileName)
  const file = files[fileName]

  const [markers, setMarkers] = useState<any>()
  const editorRef = useRef<any>(null)

  const [runTestPending, setRunTestPending] = useState(false)

  const handleCompileCode = () => {
    if (markers?.length > 0) return

    executeCode(
      {
        language: file.language,
        version: file.version,
        files: [{ content: value! }],
      },
      {
        onSuccess: (res) => {
          onExecute?.(res.run.output)

          // Keep
          console.log(`Output: ${res.run.output}`)
        },
      }
    )
  }

  const handleRunTest = async () => {
    if (markers?.length > 0) return

    if (!value || !testCase) {
      toast.error('Vui lòng nhập mã và bài kiểm tra')
      return
    }

    try {
      setRunTestPending(true)
      const result = await runTestCase(value, testCase)
      if (result) onRunTest?.(result)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Lỗi khi chạy bài kiểm tra')
    } finally {
      setRunTestPending(false)
    }
  }

  useEffect(() => {
    editorRef.current?.focus()
  }, [file.name])

  return (
    <div className="relative flex h-full flex-col">
      <div
        className={cn(
          'flex items-end justify-start',
          'rounded-none bg-[#151515] pb-0'
        )}
      >
        {Object.values(files).map((file) => {
          return (
            <button
              key={file.name}
              className={cn(
                'px-4 py-2 text-sm text-white opacity-50',
                file.name === fileName &&
                  'border-white bg-[#1e1e1e] opacity-100'
              )}
              disabled={file.name === fileName}
              onClick={() => setFileName(file.name)}
            >
              {file.name}
            </button>
          )
        })}

        <Button
          size="icon"
          className="ml-auto mr-2 bg-transparent hover:bg-transparent"
          onClick={() => {
            onChange?.(files[firstFileName]?.value, fileName)
          }}
        >
          <RotateCcw />
        </Button>
      </div>

      <div className="flex-1 bg-[#1e1e1e] pt-5">
        <Editor
          theme={theme}
          value={value}
          onChange={(value) => {
            onChange?.(value, fileName)
          }}
          path={file.name}
          defaultLanguage={file.language}
          defaultValue={file.value}
          onMount={(editor) => (editorRef.current = editor)}
          onValidate={(markers) => setMarkers(markers)}
          options={{
            readOnly,
          }}
          {...rest}
        />
      </div>

      {(execute || testCase) && (
        <div className="absolute bottom-6 left-6 flex gap-2">
          {testCase && (
            <LoadingButton
              variant="secondary"
              onClick={handleRunTest}
              disabled={isPending || markers?.length > 0 || disabled}
              loading={runTestPending}
            >
              Chạy bài kiểm tra
            </LoadingButton>
          )}

          {execute && (
            <Button
              variant={testCase ? 'ghost' : 'secondary'}
              onClick={handleCompileCode}
              disabled={isPending || markers?.length > 0 || disabled}
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CirclePlay />
              )}
              Chạy mã
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default MonacoEditor
