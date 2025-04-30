'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  CirclePlay,
  Eye,
  Share2,
  Bookmark,
  Clock,
  Calendar,
} from 'lucide-react'
import { useState } from 'react'
import { LiveSession } from '@/types/Live'

type Props = {
  livestreamInfo: LiveSession
}

export const LivestreamCard = ({ livestreamInfo }: Props) => {
  const { user } = useAuthStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const isAuthor = user?.code === livestreamInfo?.instructor?.code

  const formatViews = (views: number | '') => {
    const viewCount = typeof views === 'number' ? views : 0
    if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`
    }
    return viewCount.toString()
  }

  const thumbnailRandom = {
    live: 'https://res.cloudinary.com/dvrexlsgx/image/upload/v1745869020/Gemini_Generated_Image_nkbuicnkbuicnkbu_qz4jrz.jpg',
    upcoming:
      'https://res.cloudinary.com/dvrexlsgx/image/upload/v1745869019/Gemini_Generated_Image_ruui3nruui3nruui_ljsypw.jpg',
  }

  const thumbnailSrc = livestreamInfo?.thumbnail
    ? livestreamInfo.thumbnail
    : thumbnailRandom[livestreamInfo?.status as keyof typeof thumbnailRandom] ||
      thumbnailRandom.upcoming

  const getStatusBadge = () => {
    switch (livestreamInfo?.status) {
      case 'live':
        return (
          <div
            className="flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase text-white"
            style={{ backgroundColor: '#E27447' }}
          >
            <span className="mr-1.5 size-2 animate-pulse rounded-full bg-white"></span>
            Trực tiếp
          </div>
        )
      case 'upcoming':
        return (
          <div className="flex items-center space-x-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase text-white">
            <Calendar size={12} />
            <span>
              {livestreamInfo?.starts_at
                ? livestreamInfo.starts_at.toLocaleString()
                : ''}
            </span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/room-live-stream/${livestreamInfo?.code}`}>
        <div className="relative aspect-video w-full cursor-pointer overflow-hidden">
          <Image
            src={thumbnailSrc}
            alt={livestreamInfo?.title || 'Livestream thumbnail'}
            fill
            className={`rounded-t-lg object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />

          <div className="absolute left-3 top-3 z-10 flex items-center space-x-2">
            {getStatusBadge()}
            <div className="flex items-center space-x-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
              <Eye size={14} />
              <p>{formatViews(livestreamInfo?.view_counts ?? '')}</p>
            </div>
          </div>

          <div
            className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <CirclePlay
                size={40}
                className="text-white drop-shadow-lg"
                style={{ color: '#E27447' }}
              />
            </div>
          </div>

          {livestreamInfo?.status === 'upcoming' && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
              <Clock size={14} />
              <span>Sắp diễn ra</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-2 flex items-start justify-between">
          <Link
            href={`/room-live-stream/${livestreamInfo?.code}`}
            className="group/title"
          >
            <h2
              className="line-clamp-2 min-h-10 font-bold text-gray-800 transition-colors group-hover/title:text-[#E27447]"
              title={livestreamInfo?.title}
            >
              {livestreamInfo?.title}
            </h2>
          </Link>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="ml-1 shrink-0 text-gray-500 transition-colors hover:text-[#E27447]"
          >
            <Bookmark
              size={18}
              className={isBookmarked ? 'fill-[#E27447] text-[#E27447]' : ''}
            />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <Link
            href={
              isAuthor ? '/me' : `/profile/${livestreamInfo?.instructor?.code}`
            }
            className="group/author flex items-center space-x-2"
          >
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
              <Image
                src={livestreamInfo?.instructor?.avatar ?? ''}
                alt={livestreamInfo?.instructor?.name || 'Author'}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 transition-colors group-hover/author:text-[#E27447]">
              {livestreamInfo?.instructor?.name}
            </span>
          </Link>

          <button className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#E27447]">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {livestreamInfo?.status === 'live' && (
        <div className="absolute right-0 top-0 z-10 overflow-hidden">
          <div
            className="size-16 bg-[#E27447] shadow-md"
            style={{ transform: 'rotate(45deg) translate(50%, -50%)' }}
          />
          <div className="absolute right-0 top-0 p-1">
            <div className="flex items-center space-x-1">
              <span className="size-2 animate-pulse rounded-full bg-white"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
