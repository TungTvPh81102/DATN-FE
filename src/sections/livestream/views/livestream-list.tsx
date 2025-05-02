'use client'

import { LivestreamCard } from '@/sections/livestream/_components/livestream-card'
import { useEffect, useState } from 'react'
import { Calendar, PlayCircle } from 'lucide-react'
import { useGetLiveSessionClient } from '@/hooks/live/useLive'
import { formatDate } from '@/lib/common'

export const LivestreamList = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'live'>('all')
  const [status, setStatus] = useState<'upcoming' | 'live' | 'all'>('all')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetLiveSessionClient({ status, page })

  const livestreams = data?.live_streams?.data || []
  const totalPages = Math.ceil(
    (data?.live_streams?.total || 1) / (data?.live_streams?.per_page || 10)
  )
  const upcomingCount = data?.counts?.upcoming || 0
  const liveCount = data?.counts?.live || 0
  const totalCount = upcomingCount + liveCount

  useEffect(() => {
    if (activeTab === 'all') {
      setStatus('all')
    } else {
      setStatus(activeTab)
    }
    setPage(1)
  }, [activeTab])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const formattedLivestreams = livestreams.map((stream: any) => ({
    id: stream.id,
    code: stream.code,
    title: stream.title,
    thumbnail: stream.thumbnail ? `${stream.thumbnail}` : '',
    view_counts: 0,
    status: stream.status,
    starts_at: formatDate(stream.starts_at, {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    visibility: stream.visibility,
    instructor: {
      name: stream.instructor.name,
      avatar: stream.instructor.avatar,
      code: stream.instructor.code,
    },
  }))

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const TABS = [
    {
      id: 'all',
      label: 'Tất cả',
      count: totalCount,
    },
    {
      id: 'live',
      label: 'Đang diễn ra',
      count: liveCount,
      icon: PlayCircle,
    },
    {
      id: 'upcoming',
      label: 'Sắp diễn ra',
      count: upcomingCount,
      icon: Calendar,
    },
  ]

  return (
    <div
      className={`mx-auto space-y-6 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center space-x-2">
        <div
          className="h-6 w-1.5 rounded"
          style={{ backgroundColor: '#E27447' }}
        ></div>
        <h1 className="text-2xl font-bold text-gray-800">Sự kiện trực tiếp</h1>
      </div>

      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max space-x-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: isActive ? '#E27447' : undefined,
                }}
              >
                {Icon && <Icon size={16} />}
                <span>{tab.label}</span>
                <span
                  className={`flex items-center justify-center rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? 'bg-white text-orange-500'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-lg bg-white">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : formattedLivestreams.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {formattedLivestreams.map((item, index) => (
              <div
                key={item.code}
                className={`transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <LivestreamCard livestreamInfo={item} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`rounded-md px-4 py-2 font-medium ${
                  page === 1
                    ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Trang trước
              </button>
              <div className="text-sm font-medium text-gray-700">
                Trang {page} / {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`rounded-md px-4 py-2 font-medium ${
                  page === totalPages
                    ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                    : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                }`}
                style={{
                  backgroundColor:
                    page === totalPages ? undefined : 'rgba(226, 116, 71, 0.1)',
                  color: page === totalPages ? undefined : '#E27447',
                }}
              >
                Trang tiếp
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg bg-white">
          <p className="text-gray-500">Không có sự kiện trực tiếp nào...</p>
        </div>
      )}
    </div>
  )
}
