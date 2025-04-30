'use client'

import { ILivestreamVideo } from '@/sections/livestream/views/livestream-list'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthStore } from '@/stores/useAuthStore'
import { CirclePlay, Eye } from 'lucide-react'

type Props = {
  livestreamInfo: ILivestreamVideo
}

export const LivestreamCard = ({ livestreamInfo }: Props) => {
  const { user } = useAuthStore()

  const isAuthor = user?.code === livestreamInfo?.author?.code

  return (
    <div className="space-y-2">
      <Link href={`/room-live-stream/${livestreamInfo?.id}`}>
        <div className="group relative aspect-video w-full cursor-pointer">
          <Image
            src={livestreamInfo?.image ?? ''}
            alt={livestreamInfo?.title || 'Livestream thumbnail'}
            fill
            className="rounded-md object-cover transition duration-300"
          />

          <div className="pointer-events-none absolute inset-0 rounded-md bg-black bg-opacity-0 transition duration-300 group-hover:bg-opacity-40" />

          <div className="absolute left-2 top-2 z-10 flex items-center space-x-1">
            <div className="rounded bg-red-600 p-1 text-xs font-bold uppercase text-white">
              trực tiếp
            </div>
            <div className="flex items-center space-x-1 rounded bg-black bg-opacity-40 p-1 text-xs text-white">
              <Eye size={16} />
              <p>{livestreamInfo?.views}</p>
            </div>
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <CirclePlay size={48} strokeWidth={1} className="text-white" />
          </div>
        </div>
      </Link>

      <div className="flex items-start space-x-2">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
          <Link
            href={isAuthor ? '/me' : `/profile/${livestreamInfo?.author?.code}`}
          >
            <Image
              src={livestreamInfo?.author?.avatar ?? ''}
              alt={livestreamInfo?.author?.name || 'Author thumbnail'}
              fill
              className="rounded-md object-cover"
            />
          </Link>
        </div>

        <div className="flex-1 overflow-hidden">
          <Link
            href={`/room-live-stream/${livestreamInfo?.id}`}
            className="font-bold hover:underline"
          >
            <h2 className="overflow-hidden truncate whitespace-nowrap">
              {livestreamInfo?.title}
            </h2>
          </Link>

          <Link
            href={isAuthor ? '/me' : `/profile/${livestreamInfo?.author?.code}`}
            className="text-sm opacity-70 hover:underline"
          >
            {livestreamInfo?.author?.name}
          </Link>
        </div>
      </div>
    </div>
  )
}
