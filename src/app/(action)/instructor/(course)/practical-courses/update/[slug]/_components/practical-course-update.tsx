'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import Swal from 'sweetalert2'

import ModalLoading from '@/components/common/ModalLoading'
import Container from '@/components/shared/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import {
  useGetCourseOverview,
  useSubmitCourse,
  useValidateCourse,
} from '@/hooks/instructor/course/useCourse'
import { formatPercentage } from '@/lib/common'
import { cn } from '@/lib/utils'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import { CourseStatus, CourseStatusMap } from '@/types'
import CourseObjective from '../../../../courses/update/[slug]/_components/course-objective'
import CourseOverView from '../../../../courses/update/[slug]/_components/course-over-view'
import { RequestModifyDialog } from '../../../../courses/update/[slug]/_components/request-modify-dialog'
import { ValidateCourseSheet } from '../../../../courses/update/[slug]/_components/validate-course-sheet'
import { PracticeExerciseTab } from './practice-exercise-tab'

import { useRouter } from 'next/navigation'
import 'react-circular-progressbar/dist/styles.css'
import 'react-quill/dist/quill.snow.css'

const tabs = [
  { id: 'course_overview', label: 'Tổng quan' },
  { id: 'course_objectives', label: 'Mục tiêu' },
  { id: 'practice_exercise', label: 'Bài trắc nghiệm' },
]

export const PracticalCourseUpdate = ({ slug }: { slug: string }) => {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('course_overview')
  const [openDialog, setOpenDialog] = useState(false)

  const { courseStatus, setCourseStatus } = useCourseStatusStore()

  const { data: courseOverviewData, isLoading: isCourseOverviewLoading } =
    useGetCourseOverview(slug)

  const courseStatusBadge = useMemo(() => {
    return courseOverviewData?.status
      ? CourseStatusMap[courseOverviewData.status]
      : undefined
  }, [courseOverviewData?.status])

  const { data: validateData, isLoading: isValidateLoading } =
    useValidateCourse(slug)

  const progress = useMemo(
    () => validateData?.progress ?? 0,
    [validateData?.progress]
  )

  const { mutate: submitCourse, isPending: isSubmitCoursePending } =
    useSubmitCourse()

  const courseHandleSubmit = () => {
    if (isSubmitCoursePending) return

    Swal.fire({
      title: 'Xác nhận gửi yêu cầu kiểm duyệt',
      text: 'Bạn có chắc chắn muốn gửi yêu cầu kiểm duyệt khóa học này?',
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

  useEffect(() => {
    if (courseOverviewData?.status)
      setCourseStatus(
        courseOverviewData?.status as CourseStatus,
        courseOverviewData?.modification_request
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseOverviewData?.status])

  useEffect(() => {
    if (courseOverviewData?.is_practical_course === 0) {
      router.replace(`/instructor/courses/update/${slug}`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseOverviewData?.is_practical_course])

  if (
    isCourseOverviewLoading ||
    courseOverviewData?.is_practical_course === 0
  ) {
    return <ModalLoading />
  }

  return (
    <>
      <Container>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            Cập nhật nội dung khóa học: {courseOverviewData?.name}
          </h3>
          {courseStatusBadge && (
            <Badge
              className="shrink-0 whitespace-nowrap"
              variant={courseStatusBadge.badge}
            >
              {courseStatusBadge.label}
            </Badge>
          )}
        </div>
        <div className="grid gap-8 xl:grid-cols-12">
          <div className="grid gap-x-3 gap-y-4 md:grid-cols-2 lg:grid-cols-5 xl:col-span-3 xl:flex xl:flex-col">
            <div className="flex flex-col gap-2 rounded-lg border-2 border-dashed p-4 lg:col-span-3 xl:col-span-1">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 rounded border-l-4 p-2 transition-all',
                    activeTab === tab.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-white bg-white'
                  )}
                >
                  <span
                    className={
                      activeTab === tab.id
                        ? 'font-semibold text-orange-500'
                        : 'text-gray-700'
                    }
                  >
                    {tab.label}
                  </span>

                  {validateData?.completion_status &&
                  validateData.completion_status[
                    tab.id as keyof typeof validateData.completion_status
                  ]?.status === true ? (
                    <CheckCircle
                      className={cn('size-5 shrink-0 text-green-500')}
                    />
                  ) : (
                    validateData?.completion_status &&
                    validateData.completion_status[
                      tab.id as keyof typeof validateData.completion_status
                    ]?.status === false && (
                      <XCircle className={cn('size-5 shrink-0 text-red-500')} />
                    )
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-x-2 gap-y-3 rounded-lg border-2 border-dashed p-4 lg:col-span-2 xl:col-span-1">
              <div>
                <h1 className="mb-2 text-base font-bold">Điều kiện</h1>
                <ValidateCourseSheet
                  isValidateLoading={isValidateLoading}
                  validateData={validateData}
                />
              </div>
              <div className="size-20 font-bold">
                <CircularProgressbar
                  value={validateData?.progress || 0}
                  text={formatPercentage(validateData?.progress || 0)}
                  strokeWidth={3}
                  styles={buildStyles({
                    pathColor: `#FA802B`,
                    textColor: '#FA802B',
                    trailColor: '#D6D6D6',
                  })}
                />
              </div>
            </div>
          </div>

          <div className="rounded border bg-white p-4 shadow xl:col-span-9">
            {courseOverviewData && (
              <>
                {activeTab === 'course_objectives' && (
                  <CourseObjective courseObjective={courseOverviewData} />
                )}

                {activeTab === 'course_overview' && (
                  <CourseOverView courseOverView={courseOverviewData} />
                )}

                {activeTab === 'practice_exercise' && (
                  <PracticeExerciseTab
                    slug={slug}
                    chapter={courseOverviewData.chapters[0]}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/instructor/practical-courses/">Quay trở lại</Link>
          </Button>

          <LoadingButton
            loading={isSubmitCoursePending}
            disabled={
              courseStatus === CourseStatus.PENDING ||
              (courseStatus !== CourseStatus.APPROVED && progress < 100) ||
              courseStatus === CourseStatus.MODIFY_REQUEST
            }
            onClick={
              courseStatus === CourseStatus.APPROVED
                ? () => setOpenDialog(true)
                : courseHandleSubmit
            }
            variant={
              courseStatus === CourseStatus.APPROVED
                ? 'success'
                : courseStatus === CourseStatus.MODIFY_REQUEST
                  ? 'warning'
                  : 'default'
            }
          >
            {courseStatus === CourseStatus.APPROVED
              ? 'Yêu cầu sửa đổi nội dung'
              : courseStatus === CourseStatus.REJECT
                ? 'Gửi lại thông tin khoá học'
                : courseStatus === CourseStatus.MODIFY_REQUEST
                  ? 'Chờ duyệt'
                  : 'Gửi yêu cầu kiểm duyệt'}
          </LoadingButton>
        </div>
      </Container>

      <RequestModifyDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        slug={slug}
      />
    </>
  )
}
