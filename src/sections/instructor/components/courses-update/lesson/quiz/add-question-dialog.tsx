import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'

import {
  useCreateQuestion,
  useGetQuestion,
  useUpdateQuestion,
} from '@/hooks/instructor/quiz/useQuiz'
import { StoreQuestionPayload, storeQuestionSchema } from '@/validations/lesson'

import FileCard from '@/components/shared/file-card'
import QuillEditor from '@/components/shared/quill-editor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Sortable, SortableItem } from '@/components/ui/sortable'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import { AnswerType } from '@/types'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  questionId?: string
  quizId?: string
}

const colors = [
  'bg-cyan-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-rose-400',
  'bg-purple-500',
]

const AddQuestionDialog = ({
  isOpen,
  quizId,
  onOpenChange,
  questionId,
}: Props) => {
  const { isDraftOrRejected } = useCourseStatusStore()
  const [allowMove, setAllowMove] = useState(false)

  const { data: questionData, isLoading: isQuestionLoading } =
    useGetQuestion(questionId)

  const { mutate: createQuestion, isPending: isQuestionCreatePending } =
    useCreateQuestion()
  const { mutate: updateQuestion, isPending: isQuestionUpdatePending } =
    useUpdateQuestion()

  const defaultValues: StoreQuestionPayload = {
    question: '',
    description: '',
    answer_type: AnswerType.SingleChoice,
    options: Array.from({ length: 4 }, () => ({
      answer: '',
      is_correct: 0,
    })),
    image: undefined,
  }

  const form = useForm<StoreQuestionPayload>({
    resolver: zodResolver(storeQuestionSchema),
    defaultValues,
    disabled:
      !isDraftOrRejected || isQuestionCreatePending || isQuestionUpdatePending,
  })

  const {
    formState: { errors, disabled },
  } = form

  const answerType = useWatch({ control: form.control, name: 'answer_type' })
  const image = useWatch({ control: form.control, name: 'image' })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  useEffect(() => {
    if (questionData) {
      const options = questionData.answers.map((opt: any) => ({
        answer: opt.answer,
        is_correct: opt.is_correct,
      }))

      form.reset({
        question: questionData.question,
        description: questionData.description,
        answer_type: questionData.answer_type,
        options,
        image: questionData.image,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionData])

  const handleSelectCorrectAnswer = (selectedIndex: number) => {
    const options = form.getValues('options').map((opt, i) => ({
      ...opt,
      is_correct: i === selectedIndex ? 1 : 0,
    }))

    form.setValue('options', options)
  }

  const onSubmit = (payload: StoreQuestionPayload) => {
    if (isQuestionCreatePending) return

    const onSuccess = () => {
      onOpenChange(false)
      form.reset()
    }

    if (questionId) {
      updateQuestion(
        {
          questionId,
          payload,
        },
        {
          onSuccess,
        }
      )
    } else if (quizId) {
      createQuestion(
        {
          quizId,
          payload,
        },
        {
          onSuccess,
        }
      )
    }
  }

  useEffect(() => {
    if (answerType === AnswerType.SingleChoice) {
      const options = form.getValues('options').map((opt) => ({
        ...opt,
        is_correct: 0,
      }))
      form.setValue('options', options)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerType])

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            form.reset()
            setAllowMove(false)
          }

          onOpenChange(open)
        }}
      >
        <DialogContent className="w-full lg:max-w-4xl xl:max-w-7xl">
          <DialogHeader>
            <DialogTitle>
              {isDraftOrRejected ? (questionId ? 'Sửa' : 'Tạo') : 'Thông tin'}{' '}
              câu hỏi trắc nghiệm
            </DialogTitle>
            <DialogDescription>
              Câu hỏi trắc nghiệm giúp học viên kiểm tra kiến thức.
            </DialogDescription>
          </DialogHeader>

          {!isQuestionLoading ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="max-h-[70vh] overflow-y-auto px-1 pb-1">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Câu hỏi</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nhập câu hỏi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <QuillEditor {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="answer_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại câu hỏi</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-8"
                              disabled={field.disabled}
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value={AnswerType.SingleChoice}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Một đáp án
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value={AnswerType.MultipleChoice}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Nhiều đáp án
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label
                        className={cn(
                          form.formState.errors.options && 'text-destructive'
                        )}
                      >
                        Đáp án
                      </Label>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <Sortable
                          value={fields}
                          onMove={({ activeIndex, overIndex }) =>
                            move(activeIndex, overIndex)
                          }
                          orientation="mixed"
                        >
                          {fields.map((option, index) => (
                            <SortableItem
                              key={option.id}
                              value={option.id}
                              asChild
                              asTrigger={allowMove}
                            >
                              <div className={cn('relative')}>
                                <FormField
                                  control={form.control}
                                  name={`options.${index}.answer`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <div>
                                        <FormControl>
                                          <Textarea
                                            {...field}
                                            placeholder="Nhập đáp án"
                                            className={cn(
                                              'min-h-32 resize-none border-0 px-8 py-4 text-center text-white md:text-lg',
                                              '[scrollbar-width:none] placeholder:text-white/80',
                                              colors[index],
                                              allowMove && 'cursor-grab'
                                            )}
                                          />
                                        </FormControl>

                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="absolute left-1 top-1 size-6 bg-white/10 text-lg text-white/80 hover:bg-white/20 hover:text-white"
                                          disabled={
                                            fields.length < 3 ||
                                            field.disabled ||
                                            allowMove
                                          }
                                          onClick={() => remove(index)}
                                        >
                                          <Trash2 />
                                        </Button>
                                      </div>

                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {answerType === AnswerType.SingleChoice ? (
                                  <FormField
                                    control={form.control}
                                    name={`options.${index}.is_correct`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <RadioGroup
                                            onValueChange={(value) => {
                                              handleSelectCorrectAnswer(
                                                Number(value)
                                              )
                                              if (errors.options) {
                                                form.trigger('options')
                                              }
                                            }}
                                            value={
                                              field.value ? String(index) : ''
                                            }
                                            disabled={
                                              field.disabled || allowMove
                                            }
                                            className="absolute right-1 top-1"
                                          >
                                            <FormItem>
                                              <FormControl>
                                                <RadioGroupItem
                                                  value={String(index)}
                                                  className="border-white"
                                                />
                                              </FormControl>
                                            </FormItem>
                                          </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                ) : (
                                  <FormField
                                    control={form.control}
                                    name={`options.${index}.is_correct`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value === 1}
                                            onCheckedChange={(value) => {
                                              field.onChange(value ? 1 : 0)
                                              if (errors.options) {
                                                form.trigger('options')
                                              }
                                            }}
                                            disabled={
                                              field.disabled || allowMove
                                            }
                                            className="absolute right-1 top-1 border-white"
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                )}
                              </div>
                            </SortableItem>
                          ))}
                        </Sortable>
                      </div>

                      {errors.options?.root && (
                        <p
                          className={cn(
                            'text-[0.8rem] font-medium text-destructive'
                          )}
                        >
                          {errors.options.root?.message}
                        </p>
                      )}

                      <div className="!mt-4 flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={allowMove}
                            onCheckedChange={setAllowMove}
                            disabled={disabled}
                            id="allow-move"
                          />
                          <Label
                            className="cursor-pointer"
                            htmlFor="allow-move"
                          >
                            Thay đổi vị trí
                          </Label>
                        </div>

                        {isDraftOrRejected && fields.length < 5 && (
                          <Button
                            type="button"
                            onClick={() =>
                              append({
                                answer: '',
                                is_correct: 0,
                              })
                            }
                            variant="outline"
                            disabled={disabled}
                          >
                            <Plus className="size-4" />
                            Thêm đáp án
                          </Button>
                        )}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="image"
                      render={({
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        field: { value, onChange, ...fieldProps },
                      }) => (
                        <FormItem>
                          <FormLabel>Hình ảnh</FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                {...fieldProps}
                                type="file"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0]

                                    Object.assign(file, {
                                      preview: URL.createObjectURL(file),
                                    })

                                    onChange(file)
                                  }
                                }}
                                accept="image/*"
                                className="hidden"
                              />
                            </FormControl>
                          </div>

                          {!image && (
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  document
                                    .querySelector<HTMLInputElement>(
                                      'input[type="file"]'
                                    )
                                    ?.click()
                                }}
                                disabled={disabled}
                              >
                                <ImagePlus className="size-4" />
                                Thêm hình ảnh
                              </Button>
                            </div>
                          )}

                          {image && (
                            <FileCard
                              file={
                                image instanceof File
                                  ? image
                                  : ({
                                      name:
                                        questionData?.question || 'Hình ảnh',
                                      preview: `${process.env.NEXT_PUBLIC_STORAGE}/${image}`,
                                      type: 'image/*',
                                    } as unknown as File)
                              }
                              onRemove={() => onChange(undefined)}
                              disabled={disabled}
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Hủy</Button>
                  </DialogClose>
                  <Button disabled={disabled} type="submit">
                    {(isQuestionCreatePending || isQuestionUpdatePending) && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    {questionId ? 'Cập nhật' : 'Thêm câu hỏi'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="flex min-h-60 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddQuestionDialog
