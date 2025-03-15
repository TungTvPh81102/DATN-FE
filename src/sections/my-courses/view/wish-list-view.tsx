'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useWishListStore } from '@/stores/useWishListStore'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import Swal from 'sweetalert2'

import QueryKey from '@/constants/query-key'
import {
  useDeleteWishList,
  useGetWishLists,
} from '@/hooks/wish-list/useWishList'

const WishListView = () => {
  const [courseWishList, setCourseWishList] = useState<any[]>([])
  const { removeFromWishList } = useWishListStore()

  const queryClient = useQueryClient()
  const { data: wishListData, isLoading: wishListLoading } = useGetWishLists()
  const { mutate: deleteWishList, isPending } = useDeleteWishList()

  useEffect(() => {
    if (!wishListLoading && wishListData) {
      setCourseWishList(wishListData?.data)
    }
  }, [wishListData, wishListLoading])

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

  if (wishListLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-10 animate-spin" />
          <p className="text-sm">Đang tải...</p>
        </div>
      </div>
    )
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
                <div key={index}>
                  <div className="course-item hover-img wow fadeInUp">
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
                    <div className="content">
                      <div className="meta">
                        <div className="meta-item">
                          <i className="flaticon-calendar"></i>
                          <p>{course.lessons_count} Bài bài học</p>
                        </div>
                        <div className="meta-item">
                          <i className="flaticon-clock"></i>
                          <p>16 hours</p>
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
                        <div className="number">4.9</div>
                        <i className="icon-star-1"></i>
                        <i className="icon-star-1"></i>
                        <i className="icon-star-1"></i>
                        <i className="icon-star-1"></i>
                        <svg
                          width="12"
                          height="11"
                          viewBox="0 0 12 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.54831 7.10382L3.58894 6.85477L3.41273 6.67416L1.16841 4.37373L4.24914 3.90314L4.51288 3.86286L4.62625 3.62134L5.99989 0.694982L7.37398 3.62182L7.48735 3.86332L7.75108 3.9036L10.8318 4.37419L8.58749 6.67462L8.41128 6.85523L8.4519 7.10428L8.98079 10.3465L6.24201 8.8325L6.00014 8.69879L5.75826 8.83247L3.01941 10.3461L3.54831 7.10382ZM11.0444 4.15626L11.0442 4.15651L11.0444 4.15626Z"
                            stroke="#131836"
                          ></path>
                        </svg>
                        <div className="total">(230)</div>
                      </div>
                      <div className="author">
                        Người hướng dẫn:
                        <a href="#" className="author">
                          {course.user.name || ''}
                        </a>
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
