'use client'

import { AlertTriangle, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import {
  formatDate,
  formatDuration,
  formatStringToCurrency,
} from '@/lib/common'
import { getPlanType } from '@/components/ui/plan-type-badge'
import { useGetMemberships } from '@/hooks/order/useOrder'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Image from 'next/image'
import { IMembership } from '@/types'
import DialogPaymentMemberShip from '@/sections/profile/_components/dialog-payment-member-ship'

const MyMembershipView = () => {
  const [memberships, setMemberships] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState<any>([])
  const [selectedPlanName, setSelectedPlanName] = useState('')
  const [selectedMembership, setSelectedMembership] =
    useState<IMembership | null>(null)
  const [isDialogPaymentMembership, setIsDialogPaymentMembership] =
    useState(false)

  const { data, isLoading } = useGetMemberships()

  useEffect(() => {
    if (data) {
      setMemberships(data.data)
    }
  }, [data])

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const isMembershipExpired = (endDate: string) => {
    const daysLeft = calculateDaysLeft(endDate)
    return daysLeft <= 0
  }

  const calculatePercentTimeLeft = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()

    const totalDuration = end.getTime() - start.getTime()
    const timeLeft = end.getTime() - now.getTime()

    return (timeLeft / totalDuration) * 100
  }

  const handleViewCourses = (membership: any) => {
    setSelectedCourses(membership.membership_plan.courses)
    setSelectedPlanName(membership.membership_plan.name)
    setIsDialogOpen(true)
  }

  const handleRenew = (membership: IMembership) => {
    setSelectedMembership(membership)
    setIsDialogPaymentMembership(true)
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2
            className="size-10 animate-spin"
            style={{ color: '#E27447' }}
          />
          <p className="text-sm" style={{ color: '#E27447' }}>
            Đang tải dữ liệu gói thành viên...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="section-inner mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-brand sm:text-3xl">
            Danh sách gói thành viên đã mua
          </h2>
        </div>

        <div className="row">
          {memberships?.length === 0 ? (
            <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
              <AlertTriangle className="mb-3 size-10 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Bạn chưa đăng ký gói thành viên nào
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Đăng ký gói thành viên để truy cập vào tất cả các khóa học
              </p>
              <Link
                href="/membership"
                className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-all hover:shadow-md"
              >
                Xem các gói thành viên
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {memberships.map((membership) => {
                console.log(membership)
                const daysLeft = calculateDaysLeft(membership.end_date)
                const expired = isMembershipExpired(membership.end_date)
                const planType = getPlanType(
                  membership.membership_plan.duration_months
                )
                const percentTimeLeft = calculatePercentTimeLeft(
                  membership.start_date,
                  membership.end_date
                )

                return (
                  <div key={membership.id} className="mb-4">
                    <div
                      className={`relative overflow-hidden rounded-lg border ${expired ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'} p-5 shadow-md transition-all duration-300 hover:shadow-lg`}
                    >
                      <div className="absolute right-0 top-0 px-3 py-1.5 text-xs font-medium text-white">
                        <div
                          className={`${expired ? 'bg-red-500' : planType.color} rounded-bl-lg px-3 py-1.5 shadow-md`}
                        >
                          {expired ? 'Hết hạn' : planType.name}
                        </div>
                      </div>

                      <div className="mb-4 mt-6 flex items-center">
                        <div
                          className={`mr-3 flex size-12 items-center justify-center rounded-full ${expired ? 'bg-red-500' : planType.color} text-white shadow-md`}
                        >
                          {planType.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {membership.membership_plan.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {membership.membership_plan.description}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 rounded-lg bg-gray-50 p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div
                            className={`text-xl font-bold ${expired ? 'text-red-500' : planType.textColor}`}
                          >
                            {formatStringToCurrency(
                              membership.membership_plan.price
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {membership.membership_plan.duration_months} tháng
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="mb-2 grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-gray-50 p-2">
                            <div className="text-xs text-gray-500">
                              Ngày bắt đầu
                            </div>
                            <div className="font-medium">
                              {formatDate(membership.start_date)}
                            </div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-2">
                            <div className="text-xs text-gray-500">
                              Ngày kết thúc
                            </div>
                            <div className="font-medium">
                              {formatDate(membership.end_date)}
                            </div>
                          </div>
                        </div>

                        <div className="mb-2 mt-3 flex justify-between text-sm">
                          <span className="font-medium">Trạng thái</span>
                          <span
                            className={`font-bold ${
                              expired
                                ? 'text-red-600'
                                : daysLeft > 30
                                  ? 'text-green-600'
                                  : daysLeft > 14
                                    ? 'text-orange-500'
                                    : 'text-red-600'
                            }`}
                          >
                            {expired
                              ? 'Đã hết hạn'
                              : `${daysLeft} ngày còn lại`}
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-3 rounded-full ${expired ? 'bg-red-500' : planType.color} relative transition-all duration-500 ease-out`}
                            style={{
                              width: `${expired ? '0' : Math.max(Math.min(percentTimeLeft, 100), 0)}%`,
                            }}
                          >
                            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="mb-2 font-bold text-gray-700">
                          Quyền lợi thành viên:
                        </h4>
                        <ul className="space-y-1.5">
                          {membership.membership_plan.benefits
                            .slice(0, 3)
                            .map((benefit: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div
                                  className={`mt-0.5 size-4 rounded-full ${expired ? 'bg-red-500' : planType.color} flex shrink-0 items-center justify-center`}
                                >
                                  <svg
                                    className="size-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <span className="text-xs text-gray-700">
                                  {benefit}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div className="mt-4">
                        {expired ? (
                          <Button
                            className="w-full bg-red-500 text-white hover:bg-red-600"
                            onClick={() =>
                              handleRenew(membership.membership_plan)
                            }
                          >
                            Gia hạn
                          </Button>
                        ) : (
                          <Button
                            className={`w-full ${planType.color} text-white`}
                            onClick={() => handleViewCourses(membership)}
                          >
                            Xem khóa học
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-5xl overflow-hidden p-0">
          <div className="relative">
            <div className="bg-gradient-to-r from-brand to-brand/80 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <AlertDialogHeader className="space-y-1 p-0">
                    <AlertDialogTitle className="text-2xl font-bold text-white">
                      Danh sách khoá học
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-white/80">
                      {selectedPlanName} • {selectedCourses.length} khóa học
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <Button
                  variant="ghost"
                  className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="size-5 text-white" />
                </Button>
              </div>
            </div>

            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
              <div className="relative w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="size-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Tìm kiếm khóa học..."
                />
              </div>
              <div className="flex space-x-2">
                <Button className="flex items-center gap-1 border-gray-300">
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    />
                  </svg>
                  Sắp xếp
                </Button>
                <Button className="bg-brand text-white hover:bg-brand/90">
                  Bắt đầu học
                </Button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {selectedCourses.map((course: any) => (
                  <div
                    key={course.id}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={course.thumbnail}
                        alt={course.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                          className="bg-white text-brand hover:bg-white/90"
                          onClick={() =>
                            (window.location.href = `/courses/${course.slug}`)
                          }
                        >
                          Xem trước
                        </Button>
                      </div>
                      <div className="absolute right-3 top-3 flex items-center rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                        <svg
                          className="mr-1 size-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatDuration(course.total_duration)}
                      </div>
                    </div>

                    <div className="flex grow flex-col p-4">
                      <Link
                        className="font-bold text-gray-900"
                        style={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        href={`/courses/${course.slug}`}
                      >
                        {course.name}
                      </Link>

                      <div className="mt-auto border-t border-gray-100 pt-3">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <i className="flaticon-calendar"></i>
                            <span>{course.lessons_count} bài học</span>
                          </div>
                          <div className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                            Đã bao gồm
                          </div>
                        </div>

                        <Button
                          className="w-full bg-brand text-white hover:bg-brand/90"
                          onClick={() =>
                            (window.location.href = `/learning/${course.slug}/lesson/${course.current_lesson?.id}`)
                          }
                        >
                          Học ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {selectedMembership && (
        <DialogPaymentMemberShip
          membership={selectedMembership}
          isOpen={isDialogPaymentMembership}
          onOpenChange={setIsDialogPaymentMembership}
        />
      )}
    </>
  )
}

export default MyMembershipView
