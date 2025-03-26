'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { useWishListStore } from '@/stores/useWishListStore'
import { Bell, Loader2, Search } from 'lucide-react'
import dynamic from 'next/dynamic'
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
import { ICourse, IInstructorProfile } from '@/types'
import { ICategory } from '@/types/Category'

import WishListIcon from '@/components/common/WishListIcon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Slot } from '@radix-ui/react-slot'
import { NotificationPopover } from '../notification/notification-popover'

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
        <p className="h-full animate-slide-loop whitespace-nowrap">
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
                    className="popover-content mt-2 px-6 py-3"
                    style={{ width: inputWidth }}
                  >
                    <div className="flex items-center space-x-2">
                      {searchLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Search size={16} />
                      )}
                      <p className="text-base">
                        {searchLoading || searchResults
                          ? `Kết quả cho "${debouncedQuery}"`
                          : `Không có kết quả cho "${debouncedQuery}"`}
                      </p>
                    </div>

                    {searchResults?.courses?.length > 0 && (
                      <>
                        <div className="flex items-center justify-between border-b border-solid border-gray-200 pb-3 pt-6">
                          <h3 className="text-xl uppercase">Khoá học</h3>
                        </div>
                        <ul>
                          {searchResults?.courses?.map((course: ICourse) => (
                            <li key={course?.id} className="py-2">
                              <Link href={`/courses/${course?.slug}`}>
                                <div
                                  className="flex w-fit items-center space-x-3"
                                  data-bs-dismiss="offcanvas"
                                  onClick={() => setQuery('')}
                                >
                                  <Image
                                    src={course?.thumbnail}
                                    alt={course?.name}
                                    width={128}
                                    height={128}
                                    className="size-12 rounded-full object-cover"
                                  />
                                  <p className="text-base">{course?.name}</p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {searchResults?.instructors?.length > 0 && (
                      <>
                        <div className="flex items-center justify-between border-b border-solid border-gray-200 pb-3 pt-6">
                          <h3 className="text-xl uppercase">Người hướng dẫn</h3>
                        </div>
                        <ul>
                          {searchResults?.instructors?.map(
                            (instructor: IInstructorProfile) => (
                              <li key={instructor?.id}>
                                <div
                                  className="flex w-fit items-center space-x-3"
                                  data-bs-dismiss="offcanvas"
                                  onClick={() => setQuery('')}
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={instructor?.avatar ?? ''}
                                      alt={instructor?.name}
                                    />
                                    <AvatarFallback>
                                      {instructor?.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="text-base">
                                    {instructor?.name}
                                  </p>
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      </>
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
