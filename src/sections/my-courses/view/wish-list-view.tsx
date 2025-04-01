'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useWishListStore } from '@/stores/useWishListStore'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, X } from 'lucide-react'
import Swal from 'sweetalert2'

import QueryKey from '@/constants/query-key'
import {
  useDeleteWishList,
  useGetWishLists,
} from '@/hooks/wish-list/useWishList'
import { formatDuration } from '@/lib/common'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'

const WishListView = () => {
  const [courseWishList, setCourseWishList] = useState<any[]>([])
  const { removeFromWishList } = useWishListStore()

  const queryClient = useQueryClient()
  const { data: wishListData, isLoading: wishListLoading } = useGetWishLists()
  const { mutate: deleteWishList, isPending } = useDeleteWishList()
  const router = useRouter()
  const { user } = useAuthStore()

  console.log('wishListData', wishListData)

  useEffect(() => {
    if (!wishListLoading && wishListData) {
      setCourseWishList(wishListData?.data)
    }
  }, [wishListData, wishListLoading])

  const handleNavigate = (code: string) => {
    const targetPath = user?.code === code ? '/me' : `/profile/${code}`
    router.push(targetPath)
  }

  const handleRemove = (id: number) => {
    if (isPending) return

    Swal.fire({
      title: 'Xoá khóa học khỏi danh sách yêu thích?',
      text: 'Bạn có chắc chắn muốn xoá khóa học này khỏi danh sách yêu thích?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E27447',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      background: '#ffffff',
      customClass: {
        popup: '!rounded-xl',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteWishList(id, {
          onSuccess: () => {
            const updatedList = courseWishList.filter(
              (course) => course.id !== id
            )
            setCourseWishList(updatedList)
            removeFromWishList(id)

            if (updatedList.length === 0) {
              queryClient.invalidateQueries({
                queryKey: [QueryKey.WISH_LIST],
              })
            }
          },
        })
      }
    })
  }

  return (
    <>
      <section className="section-inner mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-brand sm:text-3xl">
            Danh sách yêu thích
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Các khóa học bạn đã đánh dấu để xem sau.
          </p>
        </div>
        <div className="row mb-[50px]">
          {courseWishList.length == 0 ? (
            <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
              <AlertTriangle className="mb-3 size-10 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Danh sách yêu thích trống
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Bạn chưa thêm khóa học nào vào danh sách yêu thích
              </p>
              <Link
                href="/courses"
                className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-all hover:shadow-md"
              >
                Khám phá khóa học
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {courseWishList?.map((course: any, index: number) => (
                <div key={index} className="mb-4">
                  <div className="course-item hover-img wow fadeInUp overflow-hidden rounded-lg border shadow-md">
                    <div className="features image-wrap">
                      <Image
                        className="lazyload"
                        src={course.thumbnail || ''}
                        alt=""
                        width={270}
                        height={160}
                      />
                      <button
                        className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-200"
                        onClick={() => handleRemove(course.id)}
                      >
                        <X className="size-5 text-red-500" />
                      </button>
                    </div>
                    <div className="content p-4">
                      <div className="meta">
                        <div className="meta-item">
                          <i className="flaticon-calendar"></i>
                          <p>{course.lessons_count} bài học</p>
                        </div>
                        <div className="meta-item">
                          <i className="flaticon-clock"></i>
                          <p>
                            {formatDuration(course?.total_video_duration ?? 0)}
                          </p>
                        </div>
                      </div>
                      <h6 className="fw-5 line-clamp-2">
                        <Link
                          style={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          href={`/courses/${course.slug}`}
                        >
                          {course.name || ''}
                        </Link>
                      </h6>

                      <div className="ratings pb-30">
                        {course.ratings?.count > 0 ? (
                          <>
                            <div className="stars flex items-center">
                              {Array.from({ length: 5 }, (_, index) => (
                                <i
                                  key={index}
                                  className={`icon-star-1 ${
                                    index < Math.round(course.ratings.average)
                                      ? 'text-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                ></i>
                              ))}
                            </div>
                            <div className="total text-sm text-gray-500">
                              ({course.ratings.count} lượt đánh giá)
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Chưa có lượt đánh giá
                          </div>
                        )}
                      </div>

                      <div className="author flex items-center space-x-1">
                        <p>Người hướng dẫn:</p>
                        <Link
                          href={`/profile/${course?.user?.code}`}
                          onClick={(e) => {
                            e.preventDefault()
                            handleNavigate(course?.user?.code)
                          }}
                        >
                          {course.user.name || ''}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default WishListView
