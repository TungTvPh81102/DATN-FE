'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MoveLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldErrors, useForm, useWatch } from 'react-hook-form'

import ModalLoading from '@/components/common/ModalLoading'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Language, LANGUAGE_CONFIG } from '@/constants/language'
import {
  useGetLessonCoding,
  useUpdateCodingLesson,
} from '@/hooks/instructor/lesson/useLesson'
import { cn } from '@/lib/utils'
import {
  UpdateCodingLessonPayload,
  updateCodingLessonSchema,
} from '@/validations/course'
import GuideTab from './guide-tab'
import SolutionTab from './solution-tab'

enum Tab {
  PLAN = 'plan',
  SOLUTION = 'solution',
  GUIDE = 'guide',
}

const tabFields: Record<Tab, (keyof UpdateCodingLessonPayload)[]> = {
  [Tab.PLAN]: ['title', 'language'],
  [Tab.SOLUTION]: ['test_case', 'ignore_test_case'],
  [Tab.GUIDE]: ['content', 'hints', 'instruct', 'sample_code'],
}

const getTabName = (tab: Tab) => {
  switch (tab) {
    case Tab.PLAN:
      return 'Kế hoạch tập luyện'
    case Tab.SOLUTION:
      return 'Giải pháp'
    case Tab.GUIDE:
      return 'Hướng dẫn'
    default:
      return ''
  }
}

const getTabsWithErrors = (errors: FieldErrors): Tab[] => {
  return Object.values(Tab).filter((tab) => {
    const fields = tabFields[tab]
    return fields.some((field) => !!errors[field])
  })
}

const CourseCodingView = ({
  slug,
  codingId,
}: {
  slug: string
  codingId: string
}) => {
  const [tab, setTab] = useState<Tab>(Tab.PLAN)
  const [errorTabs, setErrorTabs] = useState<Tab[]>([])

  const router = useRouter()
  const { data: lessonCoding, isLoading } = useGetLessonCoding(slug, codingId)
  const updateCodingLesson = useUpdateCodingLesson()

  const disabled = updateCodingLesson.isPending

  const form = useForm<UpdateCodingLessonPayload>({
    resolver: zodResolver(updateCodingLessonSchema),
    defaultValues: {
      title: '',
      language: '',
      sample_code: '',
      test_case: Array.from({ length: 2 }, () => ({ input: '', output: '' })),
      hints: [],
      instruct: '',
      content: '',
      ignore_test_case: false,
    },
    disabled,
  })

  const language = useWatch({ control: form.control, name: 'language' })

  const onSubmit = (values: UpdateCodingLessonPayload) => {
    const data = {
      ...values,
      hints: values.hints?.map((item) => item?.hint),
    }

    updateCodingLesson.mutate({
      chapterSlug: slug,
      codingId,
      data,
    })
  }

  const handleBack = () => {
    router.back()
  }

  useEffect(() => {
    form.reset({
      title: lessonCoding?.data.title || '',
      language: lessonCoding?.data.language || '',
      sample_code: lessonCoding?.data.sample_code || '',
      content: lessonCoding?.data.content || '',
      hints: lessonCoding?.data.hints?.map((hint: string) => ({ hint })) || [],
      instruct: lessonCoding?.data.instruct || '',
      test_case:
        lessonCoding?.data.test_case ||
        Array.from({ length: 2 }, () => ({ input: '', output: '' })),
      ignore_test_case: lessonCoding?.data.ignore_test_case || false,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonCoding?.data])

  useEffect(() => {
    if (!language || !lessonCoding?.data) return

    const { codeSnippet } = LANGUAGE_CONFIG[language as Language]

    if (
      !lessonCoding?.data.sample_code ||
      language !== lessonCoding?.data.language
    ) {
      form.setValue('sample_code', codeSnippet)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, lessonCoding?.data])

  useEffect(() => {
    const tabsWithErrors = getTabsWithErrors(form.formState.errors)
    setErrorTabs(tabsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(form.formState.errors).length])

  useEffect(() => {
    const tabsWithErrors = getTabsWithErrors(form.formState.errors)
    if (tabsWithErrors.length > 0) {
      setTab(tabsWithErrors[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState.submitCount])

  if (isLoading) {
    return <ModalLoading />
  }

  return (
    <div className="relative min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <header className="fixed inset-x-0 top-0 z-10 flex justify-between bg-white p-4 shadow-md">
            <div className="flex items-center gap-4">
              <MoveLeft
                className="cursor-pointer"
                onClick={handleBack}
                size={18}
              />
              <span>Quay lại chương trình giảng dạy</span>
              <span className="text-lg font-semibold">
                {lessonCoding?.data.title || 'Bài tập coding'}
              </span>
            </div>
            <Button type="submit" disabled={disabled} size="sm">
              {updateCodingLesson.isPending && (
                <Loader2 className="animate-spin" />
              )}
              Cập nhật
            </Button>
          </header>

          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as Tab)
            }}
            className="h-screen py-[68px] [&>*]:mt-0"
          >
            <TabsContent value={Tab.PLAN} className="h-full">
              <div className="container mx-auto max-w-4xl space-y-4 p-8">
                <h2 className="text-2xl font-bold">Bài tập coding</h2>
                <p className="text-muted-foreground">
                  Bài tập mã hóa cho phép người học thực hành một phần công việc
                  thực tế có mục tiêu và nhận được phản hồi ngay lập tức. Chúng
                  tôi khuyên bạn nên làm theo các bước sau: Lên kế hoạch cho bài
                  tập, xác định giải pháp và hướng dẫn người học. Điều này sẽ
                  đảm bảo bạn định hình được vấn đề và cung cấp hướng dẫn cần
                  thiết với giải pháp trong đầu.
                </p>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề bài tập</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề bài tập" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chọn ngôn ngữ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={
                          field.value || lessonCoding?.data.language
                        }
                        disabled={field.disabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngôn ngữ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(LANGUAGE_CONFIG).map(
                            ([key, value]) => (
                              <SelectItem
                                key={key}
                                value={key}
                                disabled={!value.isSupported}
                              >
                                {value.displayName}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent value={Tab.SOLUTION} className="h-full">
              <SolutionTab />
            </TabsContent>
            <TabsContent value={Tab.GUIDE} className="h-full">
              <GuideTab />
            </TabsContent>
            <footer className="fixed inset-x-0 bottom-0 z-10 flex justify-center border-t bg-white p-4">
              <TabsList className="flex gap-4">
                {Object.values(Tab).map((tab) => (
                  <TabsTrigger
                    key={tab}
                    className={cn(
                      'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                      errorTabs.includes(tab) &&
                        'border border-destructive text-destructive'
                    )}
                    value={tab}
                  >
                    {getTabName(tab)}
                    {errorTabs.includes(tab) && ' ⚠️'}
                  </TabsTrigger>
                ))}
              </TabsList>
            </footer>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}

export default CourseCodingView
