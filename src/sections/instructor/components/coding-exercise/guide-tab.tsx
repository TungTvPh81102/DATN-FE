'use client'

import { GripVertical, Trash } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { UpdateCodingLessonPayload } from '@/validations/course'

import MonacoEditor from '@/components/shared/monaco-editor'
import { TiptapEditor } from '@/components/tiptap-editor'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '@/components/ui/sortable'
import { Language, LANGUAGE_CONFIG } from '@/constants/language'

const GuideTab = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'guide' | 'hints'>(
    'content'
  )

  const {
    control,
    formState: { disabled },
  } = useFormContext<UpdateCodingLessonPayload>()

  const { fields, append, remove, move } = useFieldArray({
    name: 'hints',
  })

  const language = useWatch({ name: 'language' })

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

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={30} defaultSize={55} className="flex flex-col">
        <div className="flex h-14 shrink-0 items-center gap-4 border-b px-4 py-2 text-lg font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`rounded-lg px-4 py-1 shadow transition-colors duration-300 ${
              activeTab === 'content'
                ? 'bg-primary/10 font-bold text-primary'
                : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
            }`}
          >
            Nội dung
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hints')}
            className={`rounded-lg px-4 py-1 shadow transition-colors duration-300 ${
              activeTab === 'hints'
                ? 'bg-primary/10 font-bold text-primary'
                : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
            }`}
          >
            Gợi ý
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`rounded-lg px-4 py-1 shadow transition-colors duration-300 ${
              activeTab === 'guide'
                ? 'bg-primary/10 font-bold text-primary'
                : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
            }`}
          >
            Hướng dẫn
          </button>
        </div>

        {activeTab === 'content' && (
          <FormField
            control={control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex h-0 flex-1 flex-col p-4">
                <FormDescription className="text-base">
                  Cung nội dung bài học chi tiết, bao gồm các hướng dẫn, ví dụ
                  minh hoạ và lý thuyết liên quan.
                </FormDescription>

                <FormControl>
                  <TiptapEditor toolbar="full" {...field} />
                </FormControl>
                <FormMessage className="mt-2" />
              </FormItem>
            )}
          />
        )}

        {activeTab === 'hints' && (
          <div className="space-y-3 overflow-y-auto p-4 scrollbar-thin">
            <p className="text-base text-muted-foreground">
              Các gợi ý sẽ được mở khóa sau lần thực hiện thất bại thứ hai để
              học viên có thể nhận được nhiều hỗ trợ hơn ngoài các bài giảng và
              bài kiểm tra liên quan.
            </p>

            <div className="flex w-full flex-col gap-3">
              <Sortable
                value={fields}
                onMove={({ activeIndex, overIndex }) =>
                  move(activeIndex, overIndex)
                }
                overlay={
                  <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
                    <div className="h-9 w-full rounded-sm bg-black/5" />
                    <div className="size-9 shrink-0 rounded-sm bg-black/5" />
                    <div className="size-9 shrink-0 rounded-sm bg-black/5" />
                  </div>
                }
              >
                {fields.map((field, index) => (
                  <SortableItem key={field.id} value={field.id} asChild>
                    <div className="grid grid-cols-[1fr,auto,auto] items-start gap-2">
                      <FormField
                        control={control}
                        name={`hints.${index}.hint`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={`Nhập gợi ý thứ ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <SortableDragHandle>
                        <GripVertical />
                      </SortableDragHandle>
                      <Button
                        variant="outline"
                        type="button"
                        size="icon"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => {
                          remove(index)
                        }}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </SortableItem>
                ))}
              </Sortable>
            </div>

            <Button
              type="button"
              disabled={fields.length >= 10 || disabled}
              onClick={() =>
                append({
                  hint: '',
                })
              }
            >
              Thêm gợi ý
            </Button>
          </div>
        )}

        {activeTab === 'guide' && (
          <FormField
            control={control}
            name="instruct"
            render={({ field }) => (
              <FormItem className="flex h-0 flex-1 flex-col p-4">
                <FormDescription className="text-base">
                  Cung cấp hướng dẫn để người học biết họ đang giải quyết vấn đề
                  gì.
                </FormDescription>

                <FormControl>
                  <TiptapEditor {...field} scrollAreaClassName="h-[600px]" />
                </FormControl>
                <FormMessage className="mt-2" />
              </FormItem>
            )}
          />
        )}
      </ResizablePanel>
      <ResizableHandle withHandle />

      <ResizablePanel minSize={30}>
        <FormField
          control={control}
          name="sample_code"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, ...field } }) => (
            <FormItem className="flex h-full flex-col space-y-0 text-white">
              <div className="flex h-14 items-center gap-2 border-b border-gray-500 bg-[#0d0d0d] px-4 py-2">
                <FormLabel className="text-lg font-bold">
                  File của học viên
                </FormLabel>

                <FormMessage />
              </div>

              <div className="h-[calc(100%-3.5rem)]">
                <MonacoEditor
                  files={files}
                  readOnly={field.disabled}
                  {...field}
                />
              </div>
            </FormItem>
          )}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default GuideTab
