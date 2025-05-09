'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { useWishListStore } from '@/stores/useWishListStore'
import { Bell, BookOpen, Loader2, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'

import { Role } from '@/constants/role'
import { useLogOut } from '@/hooks/auth/useLogOut'
import { useGetCategories } from '@/hooks/category/useCategory'
import { useDebounce } from '@/hooks/debounce/useDebounce'
import { useSearch } from '@/hooks/search/userSearch'
import { useGetWishLists } from '@/hooks/wish-list/useWishList'
import { IInstructorProfile } from '@/types'
import { ICategory } from '@/types/Category'

import WishListIcon from '@/components/common/WishListIcon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Slot } from '@radix-ui/react-slot'
import { NotificationPopover } from '../notification/notification-popover'
import { formatStringToCurrency } from '../../lib/common'
import dynamic from 'next/dynamic'
import { useGetRecentCourse } from '@/hooks/user/useUser'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const MobileMenu = dynamic(() => import('./MobileMenu'), {
  ssr: false,
})

const Header = () => {
  const [query, setQuery] = useState('')
  const [inputWidth, setInputWidth] = useState(0)

  const { user, isAuthenticated, role } = useAuthStore()
  const { isPending, mutate } = useLogOut()
  const { data: wishListData } = useGetWishLists()
  const setWishList = useWishListStore((state) => state.setWishList)
  useGetWishLists()
  const { data: categoryData } = useGetCategories()
  const debouncedQuery = useDebounce(query, 300)
  const { data: searchResults, isLoading: searchLoading } =
    useSearch(debouncedQuery)
  const { data: RecentCoursData } = useGetRecentCourse()

  const router = useRouter()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleCategorySelect = (categorySlug: string) => {
    const updatedFilters = { categories: [categorySlug] }
    localStorage.setItem('courseFilters', JSON.stringify(updatedFilters))

    window.dispatchEvent(new Event('courseFiltersUpdated'))

    router.push('/courses')
  }

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth)
    }
  }, [])

  useEffect(() => {
    if (wishListData) {
      const ids = wishListData?.data.map((item: any) => item.course_id)
      setWishList(ids)
    }
  }, [wishListData, setWishList])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleLogout = () => {
    if (isPending) return

    Swal.fire({
      title: 'Bạn có chắc muốn đăng xuất?',
      text: 'Bạn sẽ cần đăng nhập lại để tiếp tục!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E27447',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
    }).then((result: any) => {
      if (result.isConfirmed) {
        mutate()
      }
    })
  }

  const dropdownMenuLinks = [
    {
      content: (
        <div className="flex items-center space-x-2">
          <Avatar className="size-14">
            <AvatarImage
              src={user?.avatar || '/assets/images/avatar/user-1.png'}
              alt="@shadcn"
            />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="max-w-[150px] truncate text-lg">{user?.name}</div>
            <div className="max-w-[150px] truncate text-sm text-gray-400">
              {user?.email}
            </div>
          </div>
        </div>
      ),
      href: '/me',
      separator: true,
    },
    {
      content: 'Học tập',
      href: '/my-courses?tab=all',
    },
    {
      content: 'Hội viên',
      href: '/my-courses?tab=membership',
    },
    {
      content: 'Mã giảm giá',
      href: '/my-courses?tab=coupon',
    },
    {
      content: 'Chứng chỉ',
      href: '/my-courses?tab=certificate',
    },
    {
      content: 'Khóa học yêu thích',
      href: '/my-courses?tab=wishlist',
    },
    {
      content:
        role === Role.INSTRUCTOR ? (
          <a className="block" href="/instructor">
            Trang người hướng dẫn
          </a>
        ) : (
          'Trở thành người hướng dẫn'
        ),
      href: role === Role.INSTRUCTOR ? undefined : '/become-an-instructor',
      separator: true,
    },
    {
      content: 'Vận may',
      href: '/lucky-wheel',
    },
    {
      content: 'Thông báo',
      href: '#',
    },
    {
      content: <a href="/chats">Tin nhắn</a>,
      separator: true,
    },

    {
      content: 'Trợ giúp và Hỗ trợ',
      href: '#',
    },
    {
      content: <div onClick={handleLogout}>Đăng xuất</div>,
    },
  ]

  return (
    <>
      <div className="tf-top-bar overflow-x-hidden">
        <p
          className={cn(
            'h-full animate-slide-loop whitespace-nowrap',
            'sm:duration-20s md:duration-25s lg:duration-30s xl:duration-35s 2xl:duration-40s'
          )}
        >
          Chào mừng bạn đến với nền tảng học tập trực tuyến tại CourseMeLy
        </p>
      </div>
      <header id="header_main" className="header">
        <div className="header-inner">
          <div className="header-inner-wrap">
            <div className="header-left">
              <a
                className="mobile-nav-toggler mobile-button d-lg-none flex"
                href="#menu"
              />
              <div id="site-logo">
                <Link href="/" rel="home" className="flex items-center gap-2">
                  <Image
                    src="/images/Logo.png"
                    alt="CourseMeLy logo"
                    width={40}
                    height={40}
                    className="shrink-0 rounded-md"
                  />
                  <span className="truncate text-xl font-extrabold">
                    CourseMeLy
                  </span>
                </Link>
              </div>
              <nav className="main-menu">
                <ul className="navigation">
                  <li className="current">
                    <Link href="/">Trang chủ</Link>
                  </li>
                  <li className="has-children">
                    <a href="#">Danh mục</a>
                    <ul>
                      {categoryData?.data?.map((category: ICategory) => (
                        <li key={category.id}>
                          <Link
                            style={{
                              width: '100%',
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            onClick={(e) => {
                              e.preventDefault()
                              handleCategorySelect(category?.slug)
                            }}
                            href={`/course/${category?.slug}`}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="">
                    <Link href="/courses">Khoá học</Link>
                  </li>
                  <li className="">
                    <Link href="/blogs">Bài viết</Link>
                  </li>
                  <li className="">
                    <Link href="/room-live-stream">Trực tiếp</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="header-right grow !justify-end">
              <a
                className="header-search-icon flex w-10 items-center justify-center"
                href="#canvasSearch"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
              >
                <i className="icon-search fs-20"></i>
              </a>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 hover:bg-transparent hover:text-primary [&_svg]:size-5"
                  >
                    <BookOpen className="stroke-[1.6]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="p-4">
                    <h3 className="mb-3 text-lg font-semibold text-primary">
                      Khóa học gần đây
                    </h3>
                    {RecentCoursData?.data?.courses?.length > 0 ? (
                      <>
                        <div className="space-y-3">
                          {RecentCoursData?.data?.courses
                            ?.slice(0, 3)
                            .map((course: any) => (
                              <Link
                                key={course.id}
                                href={`/learning/${course.slug}/lesson/${course.current_lesson?.id}`}
                                className="flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-gray-50"
                              >
                                <Image
                                  src={course?.thumbnail}
                                  alt={course?.name}
                                  width={80}
                                  height={60}
                                  className="h-16 w-20 rounded-md object-cover shadow-sm"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="mb-1 truncate text-sm font-medium">
                                    {course.name}
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                                      <div
                                        className="h-1.5 rounded-full bg-primary"
                                        style={{
                                          width: `${course.progress_percent}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="ml-2">
                                      {course.progress_percent}%
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                        </div>
                        <div className="mt-3 border-t border-gray-100 pt-4">
                          <Link
                            href="/my-courses?tab=courses-history"
                            className="block w-full rounded-lg bg-primary px-4 py-2 text-center text-sm text-white hover:bg-primary/90 hover:text-white"
                          >
                            Xem tất cả
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="py-4 text-center text-gray-500">
                        Chưa có khóa học nào được xem gần đây
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <WishListIcon />

              <NotificationPopover
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 hover:bg-transparent hover:text-primary [&_svg]:size-5"
                  >
                    <Bell className="stroke-[1.6]" />
                  </Button>
                }
              />

              {isAuthenticated ? (
                <>
                  <div className="dropdown">
                    <a
                      href="#"
                      role="button"
                      id="dropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={
                            user?.avatar || '/assets/images/avatar/user-1.png'
                          }
                          alt="@shadcn"
                        />
                        <AvatarFallback>Avatar</AvatarFallback>
                      </Avatar>
                    </a>
                    <ul
                      className="dropdown-menu !py-0 data-[popper-placement=bottom-start]:!-ml-5"
                      aria-labelledby="dropdownMenuLink"
                    >
                      {dropdownMenuLinks.map((link, index) => (
                        <li key={index}>
                          {link.href ? (
                            <Link href={link.href} className="dropdown-item">
                              {link.content}
                            </Link>
                          ) : (
                            <Slot className="dropdown-item cursor-pointer">
                              {link.content}
                            </Slot>
                          )}

                          {link.separator && <Separator />}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="header-btn">
                    <div className="header-login">
                      <Link
                        href="/sign-up"
                        className="tf-button-default header-text"
                      >
                        Đăng ký
                      </Link>
                    </div>
                    <div className="header-register">
                      <Link
                        href="/sign-in"
                        className="tf-button-default active header-text"
                      >
                        Đăng nhập
                      </Link>
                    </div>
                    <div className="header-join flex lg:hidden">
                      <Link href="/sign-in" className="fs-15">
                        Join
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <MobileMenu />
      </header>

      <div
        className="offcanvas offcanvas-top offcanvas-search"
        id="canvasSearch"
      >
        <i
          className="flaticon-close-1 btn-close cursor-pointer"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => setQuery('')}
        ></i>
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="offcanvas-body">
                <form action="#" className="form-search-courses">
                  <div className="icon">
                    <i className="icon-keyboard"></i>
                  </div>
                  <fieldset>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Tìm kiếm khoá học, bài viết, người hướng dẫn..."
                      name="text"
                      value={query}
                      onChange={handleSearch}
                      aria-required="true"
                    />
                  </fieldset>
                  <div className="button-submit">
                    <button
                      className=""
                      type="submit"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="icon-search fs-20"></i>
                    </button>
                  </div>
                </form>
                {debouncedQuery.trim() !== '' && (
                  <div
                    className="popover-content mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4"
                    style={{ width: inputWidth }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {searchLoading ? (
                          <Loader2 className="size-4 animate-spin text-primary" />
                        ) : (
                          <Search size={16} className="text-primary" />
                        )}
                        <p className="text-base font-medium">
                          {searchLoading
                            ? 'Đang tìm kiếm...'
                            : searchResults
                              ? `Kết quả cho "${debouncedQuery}"`
                              : `Không có kết quả cho "${debouncedQuery}"`}
                        </p>
                      </div>
                      <button
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => setQuery('')}
                        data-bs-dismiss="offcanvas"
                      >
                        <i className="flaticon-close-1 text-sm"></i>
                      </button>
                    </div>

                    {searchResults?.courses?.length === 0 &&
                      searchResults?.instructors?.length === 0 &&
                      !searchLoading && (
                        <div className="my-8 flex flex-col items-center justify-center text-center">
                          <i className="icon-search fs-24 mb-2 text-gray-400"></i>
                          <p className="text-base text-gray-500">
                            Không tìm thấy kết quả phù hợp
                          </p>
                          <p className="text-sm text-gray-400">
                            Vui lòng thử với từ khóa khác
                          </p>
                        </div>
                      )}

                    {searchResults?.courses?.length > 0 && (
                      <div className="mb-4">
                        <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
                          <h3 className="text-lg font-semibold text-primary">
                            Khoá học
                          </h3>
                          {searchResults.courses.length > 3 && (
                            <Link
                              href={`/courses?query=${encodeURIComponent(debouncedQuery)}`}
                              className="text-sm font-medium text-primary hover:underline"
                              data-bs-dismiss="offcanvas"
                              onClick={() => setQuery('')}
                            >
                              Xem tất cả
                            </Link>
                          )}
                        </div>
                        <ul className="space-y-3">
                          {searchResults?.courses
                            ?.slice(0, 3)
                            .map((course: any) => (
                              <li key={course?.id}>
                                <Link
                                  href={`/courses/${course?.slug}`}
                                  data-bs-dismiss="offcanvas"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setQuery('')
                                    router.push(`/courses/${course?.slug}`)
                                  }}
                                  className="block rounded-lg p-2 transition-all hover:bg-gray-50"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="shrink-0">
                                      <Image
                                        src={
                                          course?.thumbnail ||
                                          '/images/course-placeholder.jpg'
                                        }
                                        alt={course?.name}
                                        width={80}
                                        height={60}
                                        className="h-16 w-20 rounded-md object-cover shadow-sm"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="mb-1 truncate text-base font-medium">
                                        {course?.name}
                                      </p>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <i className="icon-user mr-1"></i>
                                        <span className="mr-2">
                                          {course?.instructor_name ||
                                            'Người hướng dẫn'}
                                        </span>
                                        {course?.price !== undefined && (
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-primary">
                                              {course?.is_free
                                                ? 'Miễn phí'
                                                : course?.price_sale &&
                                                    course?.price_sale !==
                                                      '0.00'
                                                  ? formatStringToCurrency(
                                                      course?.price_sale
                                                    )
                                                  : formatStringToCurrency(
                                                      course?.price
                                                    )}
                                            </span>
                                            {course?.price_sale &&
                                              course?.price_sale !== '0.00' &&
                                              !course?.is_free && (
                                                <span className="ml-2 text-xs text-gray-400 line-through">
                                                  {formatStringToCurrency(
                                                    course?.price
                                                  )}
                                                </span>
                                              )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {searchResults?.instructors?.length > 0 && (
                      <div>
                        <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
                          <h3 className="text-lg font-semibold text-primary">
                            Người hướng dẫn
                          </h3>
                          {searchResults.instructors.length > 3 && (
                            <Link
                              href={`/instructors?query=${encodeURIComponent(debouncedQuery)}`}
                              className="text-sm font-medium text-primary hover:underline"
                              data-bs-dismiss="offcanvas"
                              onClick={() => setQuery('')}
                            >
                              Xem tất cả
                            </Link>
                          )}
                        </div>
                        <ul className="space-y-3">
                          {searchResults?.instructors
                            ?.slice(0, 3)
                            .map((instructor: IInstructorProfile) => (
                              <li key={instructor?.id}>
                                <Link
                                  href={`/instructors/${instructor?.code || instructor?.id}`}
                                  data-bs-dismiss="offcanvas"
                                  onClick={() => setQuery('')}
                                  className="block rounded-lg p-2 transition-all hover:bg-gray-50"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="size-12 ring-2 ring-gray-100">
                                      <AvatarImage
                                        src={instructor?.avatar ?? ''}
                                        alt={instructor?.name}
                                      />
                                      <AvatarFallback className="bg-primary/10 text-primary">
                                        {instructor?.name
                                          ?.charAt(0)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                      <p className="mb-1 truncate text-base font-medium">
                                        {instructor?.name}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
