'use client'

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
import CourseChapterTab from './course-chapter-tab'
import CourseObjective from './course-objective'
import CourseOverView from './course-over-view'
import CourseStructure from './course-structure'
import FilmEditing from './film'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import { CourseStatus, CourseStatusMap } from '@/types'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import 'react-quill/dist/quill.snow.css'
import Swal from 'sweetalert2'
import { RequestModifyDialog } from './request-modify-dialog'
import { ValidateCourseSheet } from './validate-course-sheet'
import { useRouter } from 'next/navigation'

enum GroupId {
  PLANNING = 'planning',
  CONTENT = 'content',
}

enum TabId {
  COURSE_OBJECTIVES = 'course_objectives',
  STRUCTURE = 'structure',
  FILM = 'film',
  COURSE_OVERVIEW = 'course_overview',
  COURSE_CURRICULUM = 'course_curriculum',
}

const groups = [
  {
    id: GroupId.PLANNING,
    title: 'Lên kế hoạch & lợi ích của khoá học',
    tabs: [
      { id: TabId.COURSE_OBJECTIVES, label: 'Mục tiêu khoá học' },
      { id: TabId.STRUCTURE, label: 'Cấu trúc khóa học' },
    ],
  },
  {
    id: GroupId.CONTENT,
    title: 'Tạo nội dung của bạn',
    tabs: [
      { id: TabId.FILM, label: 'Biên tập' },
      { id: TabId.COURSE_OVERVIEW, label: 'Trang đích của khóa học' },
      { id: TabId.COURSE_CURRICULUM, label: 'Chương trình giảng dạy' },
    ],
  },
]

const CourseUpdateView = ({ slug }: { slug: string }) => {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabId>(TabId.COURSE_OBJECTIVES)
  const [openDialog, setOpenDialog] = useState(false)
  const { courseStatus, setCourseStatus } = useCourseStatusStore()

  const {
    data: courseOverviewData,
    isLoading: isCourseOverviewLoading,
    error: courseOverviewError,
  } = useGetCourseOverview(slug)

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

  useEffect(() => {
    setCourseStatus(courseOverviewData?.status as CourseStatus)

    return () => {
      setCourseStatus(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseOverviewData?.status])

  useEffect(() => {
    if (courseOverviewData?.is_practical_course === 1) {
      router.replace(`/instructor/practical-courses/update/${slug}`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseOverviewData?.is_practical_course])

  if (
    isCourseOverviewLoading ||
    courseOverviewData?.is_practical_course === 1
  ) {
    return <ModalLoading />
  }

  if (courseOverviewError && (courseOverviewError as any).status === 403) {
    router.replace('/forbidden')
    return null
  }

  return (
    <>
      <Container>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            Cập nhật nội dung khoá học: {courseOverviewData?.name}
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
                <ValidateCourseSheet
                  isValidateLoading={isValidateLoading}
                  validateData={validateData}
                />
              </div>
              <div className="font-bold" style={{ width: 50, height: 50 }}>
                <CircularProgressbar
                  value={progress}
                  text={formatPercentage(progress)}
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
          </div>

          <div className="col-span-8 rounded-lg border bg-white p-4 shadow-lg xl:col-span-9">
            {(() => {
              if (!courseOverviewData) return null

              switch (activeTab) {
                case TabId.COURSE_OBJECTIVES:
                  return (
                    <CourseObjective courseObjective={courseOverviewData} />
                  )
                case TabId.STRUCTURE:
                  return <CourseStructure />
                case TabId.FILM:
                  return <FilmEditing />
                case TabId.COURSE_OVERVIEW:
                  return <CourseOverView courseOverView={courseOverviewData} />
                case TabId.COURSE_CURRICULUM:
                  return (
                    <CourseChapterTab
                      slug={slug}
                      chapters={courseOverviewData.chapters}
                      allowCoding={!!courseOverviewData.allow_coding_lesson}
                    />
                  )
                default:
                  return null
              }
            })()}
          </div>
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

export default CourseUpdateView
