'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import files from '@/sample/files'

import { cn } from '@/lib/utils'

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
})

type File = {
  name: string
  language: string
  value: string
}

const MonacoEditor = () => {
  const editorRef = useRef<any>(null)
  const [fileName, setFileName] = useState<string>('script.js')

  const file = (
    files as {
      [key: string]: File
    }
  )[fileName]

  const handleEditorChange = (value: any) => {
    console.log('here is the current model value:', value)
  }

  useEffect(() => {
    editorRef.current?.focus()
  }, [file.name])

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          'flex items-end justify-start',
          'rounded-none bg-[#151515] pb-0'
        )}
      >
        {Object.values(files).map((file) => (
          <button
            key={file.name}
            className={cn(
              'px-4 py-2 text-sm text-white opacity-50',
              file.name === fileName && 'border-white bg-[#1e1e1e] opacity-100'
            )}
            disabled={file.name === fileName}
            onClick={() => setFileName(file.name)}
          >
            {file.name}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-[#1e1e1e] pt-5">
        <Editor
          theme="vs-dark"
          onChange={handleEditorChange}
          path={file.name}
          defaultLanguage={file.language}
          defaultValue={file.value}
          onMount={(editor) => (editorRef.current = editor)}
        />
      </div>
    </div>
  )
}

export default MonacoEditor
