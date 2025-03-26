'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useGetBanners } from '@/hooks/home/banners/useBanners'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from 'react'
import '../../../styles/banner.css'
import { BannerData } from '@/types/Banner'

const Banner = () => {
  const { data: BannerData, isLoading: BannerLoading } = useGetBanners()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sortedBanners, setSortedBanners] = useState<BannerData[]>([])
  const [autoplay, setAutoplay] = useState(true)
  const [isChanging, setIsChanging] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    if (BannerData?.data.slides) {
      const sorted = [...BannerData.data.slides].sort(
        (a: BannerData, b: BannerData) => a.order - b.order
      )
      setSortedBanners(sorted)
    }
  }, [BannerData])

  useEffect(() => {
    if (!autoplay || !sortedBanners.length) return

    const interval = setInterval(() => {
      handleSlideChange(
        currentIndex === sortedBanners.length - 1 ? 0 : currentIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, sortedBanners.length, currentIndex])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bannerRef.current) return

      const rect = bannerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      setMousePosition({ x, y })
    }

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    const bannerElement = bannerRef.current
    if (bannerElement) {
      bannerElement.addEventListener('mousemove', handleMouseMove)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      if (bannerElement) {
        bannerElement.removeEventListener('mousemove', handleMouseMove)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSlideChange = useCallback((newIndex: number) => {
    setIsChanging(true)
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setTimeout(() => {
        setIsChanging(false)
      }, 50)
    }, 300)
  }, [])

  const goToPrevious = useCallback(() => {
    setAutoplay(false) // Pause autoplay when manually navigating
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? sortedBanners.length - 1 : currentIndex - 1
    handleSlideChange(newIndex)
  }, [currentIndex, sortedBanners.length, handleSlideChange])

  const goToNext = useCallback(() => {
    setAutoplay(false) // Pause autoplay when manually navigating
    const isLastSlide = currentIndex === sortedBanners.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    handleSlideChange(newIndex)
  }, [currentIndex, sortedBanners.length, handleSlideChange])

  const goToSlide = useCallback(
    (index: number) => {
      setAutoplay(false) // Pause autoplay when manually navigating
      handleSlideChange(index)
    },
    [handleSlideChange]
  )

  const getTransform = (depth: number = 1, speed: number = 1) => {
    const moveX = (mousePosition.x - 0.5) * depth
    const moveY = (mousePosition.y - 0.5) * depth
    return {
      transform: `perspective(1000px) rotateX(${moveY * speed}deg) rotateY(${-moveX * speed}deg) translateZ(0)`,
      transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  }

  const getScrollParallax = (factor: number = 0.1) => {
    return {
      transform: `translateY(${scrollPosition * factor}px)`,
      transition: 'transform 0.1s ease-out',
    }
  }

  if (BannerLoading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-12 animate-spin text-primary" />
          {/*<p className="text-lg font-medium text-gray-600">*/}
          {/*  Loading courses...*/}
          {/*</p>*/}
        </div>
      </div>
    )
  }

  if (!sortedBanners.length) {
    return (
      <div className="flex min-h-[350px] items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="mb-2 text-xl font-semibold text-gray-800">
            No courses available
          </h3>
          <p className="text-gray-600">
            Please check back later for new course offerings
          </p>
        </div>
      </div>
    )
  }

  const currentBanner = sortedBanners[currentIndex]

  return (
    <div
      ref={bannerRef}
      className="banner-section perspective-1000 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMC41IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMikiIC8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+Cjwvc3ZnPg==')] opacity-20"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="light-beam light-beam-1"></div>
        <div className="light-beam light-beam-2"></div>
        <div className="light-beam light-beam-3"></div>
      </div>

      <div
        className="absolute -left-20 top-0 size-[400px] animate-[pulse_15s_ease-in-out_infinite] rounded-full bg-blue-500/20 blur-[100px]"
        style={{
          ...getTransform(-2, 0.5),
          ...getScrollParallax(-0.05),
          transformOrigin: 'center center',
        }}
      ></div>
      <div
        className="absolute -right-20 bottom-0 size-[350px] animate-[pulse_12s_ease-in-out_infinite] rounded-full bg-purple-500/20 blur-[100px]"
        style={{
          ...getTransform(-1.5, 0.5),
          ...getScrollParallax(0.03),
          transformOrigin: 'center center',
          animationDelay: '-3s',
        }}
      ></div>
      <div
        className="absolute left-1/4 top-1/3 size-[300px] animate-[pulse_18s_ease-in-out_infinite] rounded-full bg-pink-500/20 blur-[100px]"
        style={{
          ...getTransform(-2.5, 0.5),
          ...getScrollParallax(-0.02),
          transformOrigin: 'center center',
          animationDelay: '-6s',
        }}
      ></div>
      <div
        className="absolute bottom-1/4 right-1/3 size-[250px] animate-[pulse_20s_ease-in-out_infinite] rounded-full bg-orange-500/20 blur-[100px]"
        style={{
          ...getTransform(-1.8, 0.5),
          ...getScrollParallax(0.04),
          transformOrigin: 'center center',
          animationDelay: '-9s',
        }}
      ></div>

      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`size- absolute${Math.random() > 0.5 ? 2 : 1.5} animate-float-particle rounded-full bg-white/40`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${-Math.random() * 20}s`,
              opacity: 0.3 + Math.random() * 0.7,
              ...getTransform(Math.random() * 5 + 3, 0.3),
            }}
          ></div>
        ))}
      </div>

      <div className="grid-lines absolute inset-0 opacity-10"></div>

      <div className="tf-container relative z-10 px-4 py-8 md:py-12 lg:py-16">
        <div key={currentBanner.id} className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div
              className={`order-2 transition-all duration-700 md:order-1 md:pr-6 ${isChanging ? '-translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}
              style={{
                ...getTransform(1, 0.3),
                transformOrigin: 'center left',
              }}
            >
              <div className="space-y-6">
                <div
                  className="animate-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-1.5 text-sm font-medium text-white"
                  style={{
                    ...getTransform(1.5, 0.4),
                    transformOrigin: 'left center',
                  }}
                >
                  <svg
                    className="mr-1.5 size-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 6V18M6 12H18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="relative z-10">Khóa học nổi bật</span>
                </div>

                <h2
                  className="animate-text-reveal text-3xl font-bold leading-tight text-white md:text-5xl"
                  style={{
                    ...getTransform(1.2, 0.3),
                    transformOrigin: 'left center',
                    textShadow: '0 0 15px rgba(255,255,255,0.3)',
                  }}
                >
                  {currentBanner.title || ' '}
                </h2>

                <div
                  className="animate-text-reveal animation-delay-100 text-base leading-relaxed text-gray-200 md:text-lg"
                  style={{
                    ...getTransform(1, 0.3),
                    transformOrigin: 'left center',
                  }}
                >
                  {/*{currentBanner.content || ' '}*/}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentBanner.content
                        ? currentBanner.content.length > 150
                          ? currentBanner.content.slice(0, 150) + '...'
                          : currentBanner.content
                        : ' ',
                    }}
                  />
                </div>

                <div
                  className="animate-fade-up animation-delay-200 flex flex-wrap items-center gap-4"
                  style={{
                    ...getTransform(1.3, 0.3),
                    transformOrigin: 'left center',
                  }}
                >
                  <Link
                    href={currentBanner.redirect_url || '#'}
                    className="group relative inline-flex items-center overflow-hidden rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                  >
                    <span className="relative z-10">Bắt đầu ngay</span>
                    <span className="absolute inset-0 z-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 transition-opacity duration-500"></span>
                    <svg
                      className="relative z-10 ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></span>
                  </Link>

                  <Link
                    href="/courses"
                    className="group relative inline-flex items-center overflow-hidden rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    <span className="relative z-10">Xem tất cả khóa học</span>
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>

                <div
                  className="animate-fade-up animation-delay-300 mt-8 grid grid-cols-3 gap-4 border-t border-white/20 pt-6"
                  style={{
                    ...getTransform(1.1, 0.3),
                    transformOrigin: 'center bottom',
                  }}
                >
                  <div className="group relative overflow-hidden rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:bg-white/15 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <div className="text-2xl font-bold text-white">1000+</div>
                    <div className="text-xs text-gray-300">Học viên</div>
                    <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50"></div>
                  </div>
                  <div className="group relative overflow-hidden rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:bg-white/15 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <div className="text-2xl font-bold text-white">
                      {BannerData?.data.total_courses ?? ' '}+
                    </div>
                    <div className="text-xs text-gray-300">Khóa học</div>
                    <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50"></div>
                  </div>
                  <div className="group relative overflow-hidden rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:bg-white/15 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <div className="text-2xl font-bold text-white">
                      {/*{BannerData?.data.system_average_rating ?? ' '}*/}
                      {parseFloat(
                        BannerData?.data.system_average_rating
                      ).toFixed(2) ?? ' '}
                    </div>
                    <div className="text-xs text-gray-300">Đánh giá</div>
                    <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50"></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`order-1 flex justify-center transition-all duration-700 md:order-2 md:justify-end ${isChanging ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}
              style={{
                ...getTransform(1.5, 0.3),
                transformOrigin: 'center right',
              }}
            >
              <div className="relative w-full max-w-md md:max-w-lg">
                <div
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-[0_0_25px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_0_35px_rgba(236,72,153,0.4)]"
                  style={{
                    ...getTransform(2, 0.4),
                    transformOrigin: 'center center',
                    boxShadow: `${(mousePosition.x - 0.5) * -15}px ${(mousePosition.y - 0.5) * -15}px 30px rgba(0,0,0,0.3), 0 0 30px rgba(236,72,153,0.3)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl border border-white/10 p-px">
                    <div className="absolute inset-0 rounded-2xl border-l border-t border-white/20"></div>
                    <div className="animate-glow-line absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
                    <div className="animate-glow-line-vertical absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
                  </div>

                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20 mix-blend-overlay"></div>
                    <Image
                      width={600}
                      height={338}
                      className="size-full object-cover transition-transform duration-700 hover:scale-110"
                      src={
                        currentBanner.image ||
                        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80'
                      }
                      alt={currentBanner.title || 'Course banner'}
                      priority
                      style={{
                        transform: `scale(1.05) translateX(${(mousePosition.x - 0.5) * -8}px) translateY(${(mousePosition.y - 0.5) * -8}px)`,
                        transition:
                          'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                    />

                    <div
                      className="absolute right-3 top-3 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm"
                      style={{
                        ...getTransform(3, 0.5),
                        transformOrigin: 'right top',
                      }}
                    >
                      {currentBanner?.total_student ?? ''}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.3)_100%)]"></div>

                    <div className="scan-line"></div>

                    <div className="absolute left-0 top-0 size-10 border-l-2 border-t-2 border-white/30"></div>
                    <div className="absolute right-0 top-0 size-10 border-r-2 border-t-2 border-white/30"></div>
                    <div className="absolute bottom-0 left-0 size-10 border-b-2 border-l-2 border-white/30"></div>
                    <div className="absolute bottom-0 right-0 size-10 border-b-2 border-r-2 border-white/30"></div>
                  </div>

                  <div className="relative p-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-600/5"></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div
                          className="group flex items-center gap-2"
                          style={{
                            ...getTransform(2, 0.4),
                            transformOrigin: 'left center',
                          }}
                        >
                          <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 p-2 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]">
                            <svg
                              className="size-4 text-white"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-white transition-colors duration-300 group-hover:text-blue-400">
                            {currentBanner?.title}
                          </span>
                        </div>

                        {/*<div*/}
                        {/*  className="group flex items-center gap-1 text-yellow-300"*/}
                        {/*  style={{*/}
                        {/*    ...getTransform(2, 0.4),*/}
                        {/*    transformOrigin: 'right center',*/}
                        {/*  }}*/}
                        {/*>*/}
                        {/*  <svg*/}
                        {/*    className="size-4 animate-pulse transition-transform duration-300 group-hover:rotate-12"*/}
                        {/*    viewBox="0 0 24 24"*/}
                        {/*    fill="currentColor"*/}
                        {/*  >*/}
                        {/*    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>*/}
                        {/*  </svg>*/}
                        {/*  <span className="text-sm font-medium">*/}
                        {/*    Chất lượng cao*/}
                        {/*  </span>*/}
                        {/*</div>*/}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div
                          className="group flex items-center gap-2"
                          style={{
                            ...getTransform(2, 0.4),
                            transformOrigin: 'left center',
                          }}
                        >
                          <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-2 shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.7)]">
                            <svg
                              className="size-4 text-white"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-white transition-colors duration-300 group-hover:text-pink-400">
                            Hỗ trợ 24/7
                          </span>
                        </div>

                        <div
                          className="animate-pulse rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-3 py-1 text-xs font-medium text-white shadow-lg"
                          style={{
                            ...getTransform(2, 0.4),
                            transformOrigin: 'right center',
                          }}
                        >
                          Bestseller
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -bottom-6 -left-6 size-16 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-yellow-400/70 blur-xl"
                  style={{
                    ...getTransform(4, 0.6),
                    transformOrigin: 'left bottom',
                  }}
                ></div>
                <div
                  className="absolute -right-6 -top-6 size-16 animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-blue-500/70 blur-xl"
                  style={{
                    ...getTransform(4, 0.6),
                    transformOrigin: 'right top',
                    animationDelay: '-3s',
                  }}
                ></div>
                <div
                  className="absolute -bottom-10 right-20 size-20 animate-[pulse_12s_ease-in-out_infinite] rounded-full bg-pink-500/70 blur-xl"
                  style={{
                    ...getTransform(3, 0.5),
                    transformOrigin: 'right bottom',
                    animationDelay: '-6s',
                  }}
                ></div>

                <div
                  className="absolute -left-10 top-1/2 size-8 animate-[float_15s_ease-in-out_infinite] rounded-full bg-purple-400/40 blur-md"
                  style={{
                    ...getTransform(5, 0.7),
                    transformOrigin: 'left center',
                  }}
                ></div>
                <div
                  className="absolute -right-12 bottom-1/3 size-10 animate-[float_18s_ease-in-out_infinite] rounded-full bg-cyan-400/40 blur-md"
                  style={{
                    ...getTransform(5, 0.7),
                    transformOrigin: 'right bottom',
                    animationDelay: '-5s',
                  }}
                ></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIwLjUiPgogICAgPHBhdGggZD0iTTMwIDVMMzAgNTVNNSAzMEw1NSAzME0xNSAxNUw0NSA0NU00NSAxNUwxNSA0NSIgLz4KICA8L2c+Cjwvc3ZnPg==')] opacity-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 shadow-lg backdrop-blur-md transition-all hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] focus:outline-none md:left-6"
        aria-label="Previous banner"
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 shadow-lg backdrop-blur-md transition-all hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] focus:outline-none md:right-6"
        aria-label="Next banner"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {sortedBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative h-2.5 overflow-hidden rounded-full transition-all focus:outline-none ${
              index === currentIndex
                ? 'w-10 bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                : 'w-2.5 bg-white/30 backdrop-blur-sm hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          >
            {index === currentIndex && (
              <span className="animate-progress-bar absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Banner
