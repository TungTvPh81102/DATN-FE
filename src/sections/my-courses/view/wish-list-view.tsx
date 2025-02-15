'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useWishListStore } from '@/stores/useWishListStore'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, X } from 'lucide-react'
import Swal from 'sweetalert2'

import QUERY_KEY from '@/constants/query-key'
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
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
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
                queryKey: [QUERY_KEY.WISH_LIST],
              })
            }
          },
        })
      }
    })
  }

  return (
    <>
      {wishListLoading && (
        <div className="mt-20">
          <Loader2 className="mx-auto size-8 animate-spin" />
        </div>
      )}
      <section className="section-inner mt-10">
        <div className="row mb-[50px]">
          {courseWishList?.map((course: any, index: number) => (
            <div className="col-xl-3" key={index}>
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
                    <Link href={`/courses/${course.slug}`}>
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
      </section>
    </>
  )
}

export default WishListView
