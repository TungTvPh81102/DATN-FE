'use client'

import ModalLoading from '@/components/common/ModalLoading'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  useGetCourseOverview,
  useRequestModifyContent,
  useSubmitCourse,
  useValidateCourse,
} from '@/hooks/instructor/course/useCourse'
import { formatPercentage } from '@/lib/common'
import { cn } from '@/lib/utils'
import CourseChapterTab from '@/sections/instructor/components/courses-update/course-chapter-tab'
import CourseObjective from '@/sections/instructor/components/courses-update/course-objective'
import CourseOverView from '@/sections/instructor/components/courses-update/course-over-view'
import CourseStructure from '@/sections/instructor/components/courses-update/course-structure'
import FilmEditing from '@/sections/instructor/components/courses-update/film'
import { useAuthStore } from '@/stores/useAuthStore'
import { Accordion } from '@radix-ui/react-accordion'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import 'react-quill/dist/quill.snow.css'
import Swal from 'sweetalert2'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import {
  RequestModifyContentPayload,
  requestModifyContentSchema,
} from '@/validations/course'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CourseStatus, CourseStatusMap } from '@/types'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import Container from '@/components/shared/container'
import { Badge } from '@/components/ui/badge'

type GroupId = 'planning' | 'content'

type ActiveTabs = {
  planning: string | null
  content: string | null
}

const groups = [
  {
    id: 'planning' as GroupId,
    title: 'Lên kế hoạch & lợi ích của khoá học',
    tabs: [
      { id: 'course_objectives', label: 'Mục tiêu khoá học' },
      { id: 'structure', label: 'Cấu trúc khóa học' },
    ],
  },
  {
    id: 'content' as GroupId,
    title: 'Tạo nội dung của bạn',
    tabs: [
      { id: 'film', label: 'Biên tập' },
      { id: 'course_overview', label: 'Trang đích của khóa học' },
      { id: 'course_curriculum', label: 'Chương trình giảng dạy' },
    ],
  },
]

const CourseUpdateView = ({ slug }: { slug: string }) => {
  const { user } = useAuthStore()
  const router = useRouter()

  const [activeGroup, setActiveGroup] = useState<GroupId>('planning')
  const [activeTabs, setActiveTabs] = useState<ActiveTabs>({
    planning: 'course_objectives',
    content: null,
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const openDialog = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  const { courseStatus, setCourseStatus } = useCourseStatusStore()
  const [progress, setProgress] = useState<number>(0)

  const { data: courseOverviewData, isLoading: isCourseOverviewLoading } =
    useGetCourseOverview(slug)
  const { data: validateData, isLoading: isValidateLoading } =
    useValidateCourse(slug)
  const { mutate: submitCourse, isPending: isSubmitCoursePending } =
    useSubmitCourse()
  const { mutate: requestModifyContent, isPending: isRequestModifyContent } =
    useRequestModifyContent()

  useEffect(() => {
    if (
      !isCourseOverviewLoading &&
      user?.id !== courseOverviewData?.data?.user_id
    ) {
      router.push('/forbidden')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseOverviewData?.data?.user_id, isCourseOverviewLoading, user?.id])

  useEffect(() => {
    setCourseStatus(courseOverviewData?.data.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseOverviewData?.data.status])

  useEffect(() => {
    setProgress(validateData?.data.progress || 0)
  }, [validateData?.data.progress])

  const form = useForm<RequestModifyContentPayload>({
    resolver: zodResolver(requestModifyContentSchema),
    defaultValues: {
      reason: '',
    },
  })

  const handleTabClick = (groupId: GroupId, tabId: string) => {
    setActiveGroup(groupId)
    setActiveTabs((prev) => ({
      ...prev,
      [groupId]: tabId,
    }))
  }

  const courseHandleSubmit = () => {
    if (isSubmitCoursePending) return

    Swal.fire({
      title: 'Xác nhận gửi yêu cầu kiểm duyệt',
      text: 'Bạn có chắc chắn muốn gửi yêu cầu kiểm duyệt khoá học này?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        submitCourse(slug)
      }
    })
  }

  const handleRequestModifyContent = (values: RequestModifyContentPayload) => {
    const payload = {
      slug,
      ...values,
    }

    requestModifyContent(payload)
  }

  const courseStatusBadge = useMemo(() => {
    return CourseStatusMap[courseOverviewData?.data.status as CourseStatus]
  }, [courseOverviewData?.data.status])

  if (
    isCourseOverviewLoading ||
    isValidateLoading ||
    isSubmitCoursePending ||
    isRequestModifyContent
  ) {
    return <ModalLoading />
  }

  return (
    <Container>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Cập nhật nội dung khoá học: {courseOverviewData?.data.name}
        </h3>
        <Badge
          className="shrink-0 whitespace-nowrap"
          variant={courseStatusBadge.badge}
        >
          {courseStatusBadge.label}
        </Badge>
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 xl:col-span-3">
          <div>
            {groups.map((group) => (
              <div key={group.id} className="mb-8">
                <h1 className="mb-4 text-base font-bold">{group.title}</h1>
                <div className="flex flex-col gap-2 rounded-lg border-2 border-dashed p-4">
                  {group.tabs.map((tab) => (
                    <div
                      key={tab.id}
                      onClick={() => {
                        handleTabClick(group.id, tab.id)
                      }}
                      className={`flex cursor-pointer items-center justify-between gap-2 rounded p-2 transition-all ${
                        activeGroup === group.id &&
                        activeTabs[group.id] === tab.id
                          ? 'border-l-4 border-orange-500 bg-orange-50'
                          : 'bg-white'
                      }`}
                    >
                      <span
                        className={`${
                          activeGroup === group.id &&
                          activeTabs[group.id] === tab.id
                            ? 'font-bold text-orange-500'
                            : 'text-gray-700'
                        }`}
                      >
                        {tab.label}
                      </span>
                      {validateData?.data.completion_status[tab.id]?.status ===
                      true ? (
                        <CheckCircle
                          className={cn('size-5 shrink-0 text-green-500')}
                        />
                      ) : (
                        validateData?.data.completion_status[tab.id]?.status ===
                          false && (
                          <XCircle
                            className={cn('size-5 shrink-0 text-red-500')}
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2 rounded-lg border-2 border-dashed p-4">
            <div>
              <h1 className="mb-2 text-base font-bold">Điều kiện</h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    disabled={
                      progress === 100 ||
                      isSubmitCoursePending ||
                      isRequestModifyContent
                    }
                    type="button"
                  >
                    Xem chi tiết
                  </Button>
                </SheetTrigger>
                <SheetContent
                  aria-describedby={undefined}
                  className="overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle>Các tiêu chí chưa hoàn thành</SheetTitle>
                  </SheetHeader>

                  <Accordion
                    type="single"
                    collapsible
                    className="space-y-4 py-4"
                  >
                    {Object?.entries(validateData?.data.completion_status).map(
                      ([key, value]) => {
                        const typedValue = value as {
                          status: boolean
                          errors: string[]
                        }

                        if (!typedValue.status) {
                          return (
                            <AccordionItem key={key} value={key}>
                              <AccordionTrigger className="rounded-lg">
                                {(() => {
                                  switch (key) {
                                    case 'course_objectives':
                                      return 'Mục tiêu khoá học'
                                    case 'course_overview':
                                      return 'Trang đích của khóa học'
                                    case 'course_curriculum':
                                      return 'Chương trình giảng dạy'
                                    default:
                                      return ''
                                  }
                                })()}
                              </AccordionTrigger>
                              {typedValue.errors.map((error, index) => (
                                <AccordionContent
                                  key={index}
                                  className="rounded-lg text-sm text-red-500"
                                >
                                  {error}
                                </AccordionContent>
                              ))}
                            </AccordionItem>
                          )
                        }
                      }
                    )}
                  </Accordion>
                </SheetContent>
              </Sheet>
            </div>
            <div className="font-bold" style={{ width: 50, height: 50 }}>
              <CircularProgressbar
                value={validateData?.data.progress || 0}
                text={formatPercentage(validateData?.data.progress || 0)}
                strokeWidth={3}
                styles={buildStyles({
                  pathColor: `#FA802B`,
                  textColor: '#FA802B',
                  trailColor: '#D6D6D6',
                })}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/instructor/courses/">
              <Button variant="outline">Quay trở lại</Button>
            </Link>
            <Button
              disabled={
                courseStatus === CourseStatus.Pending ||
                isSubmitCoursePending ||
                (courseStatus !== CourseStatus.Approved && progress < 100) ||
                isRequestModifyContent ||
                courseStatus === CourseStatus.ModifyRequest
              }
              onClick={
                courseStatus === CourseStatus.Approved
                  ? openDialog
                  : courseHandleSubmit
              }
              className={
                courseStatus === CourseStatus.Approved
                  ? 'bg-green-500 text-white hover:bg-green-500/80'
                  : courseStatus === CourseStatus.ModifyRequest
                    ? 'bg-yellow-500 text-white'
                    : ''
              }
            >
              {courseStatus === CourseStatus.Approved
                ? 'Yêu cầu sửa đổi nội dung'
                : courseStatus === CourseStatus.Reject
                  ? 'Gửi lại thông tin khoá học'
                  : courseStatus === CourseStatus.ModifyRequest
                    ? 'Chờ duyệt'
                    : 'Gửi yêu cầu kiểm duyệt'}
            </Button>
          </div>
        </div>
        <div className="col-span-8 rounded border bg-white p-4 shadow-lg xl:col-span-9">
          {activeGroup === 'planning' && (
            <>
              {activeTabs.planning === 'course_objectives' && (
                <CourseObjective courseObjective={courseOverviewData?.data} />
              )}
              {activeTabs.planning === 'structure' && <CourseStructure />}
            </>
          )}

          {activeGroup === 'content' && (
            <>
              {activeTabs.content === 'film' && <FilmEditing />}
              {activeTabs.content === 'course_overview' && (
                <CourseOverView courseOverView={courseOverviewData?.data} />
              )}
              {activeTabs.content === 'course_curriculum' && (
                <CourseChapterTab
                  slug={slug}
                  chapters={courseOverviewData?.data.chapters}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRequestModifyContent)}>
              <DialogTitle className="mb-2">
                Yêu cầu sửa đổi nội dung
              </DialogTitle>
              <DialogDescription>
                Hãy nhập nội dung bạn muốn yêu cầu sửa đổi. Chúng tôi sẽ xem xét
                và phản hồi lại sớm nhất.
              </DialogDescription>
              <div className="mt-4">
                <Label>Lý do </Label>
                <FormField
                  name="reason"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Nhập nội dung yêu cầu chỉnh sửa tại đây..."
                          className="h-32 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="mt-4">
                <Button variant="ghost" onClick={closeDialog}>
                  Hủy
                </Button>
                <Button type="submit">Gửi yêu cầu</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default CourseUpdateView
