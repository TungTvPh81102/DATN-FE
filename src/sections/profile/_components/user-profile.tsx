import Image from 'next/image'
import { Star, Radio } from 'lucide-react'

type Props = {
  avatar: string
  name: string
  avgRating: string
  aboutMe: string
  bio?: string[]
  isLive?: boolean
}

export const UserProfile = ({
  name,
  avatar,
  bio,
  avgRating,
  aboutMe,
  isLive = false,
}: Props) => (
  <div className="mx-auto flex max-w-md flex-col rounded-lg bg-white p-6 shadow-md">
    <div className="relative mx-auto mb-4">
      <div className="relative size-40 md:size-48">
        <Image
          src={avatar}
          alt={name}
          fill
          className="rounded-full border-4 border-gray-100 object-cover"
          priority
        />
        {isLive && (
          <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            <Radio size={16} className="animate-pulse" />
            LIVE
          </div>
        )}
      </div>
    </div>

    <div className="mb-4 text-center">
      <div className="mb-2 flex items-center justify-center gap-2">
        <h2 className="text-2xl font-bold">{name}</h2>
        <div className="flex items-center rounded-md bg-yellow-50 px-2 py-1 text-yellow-700">
          <Star size={16} className="mr-1 text-yellow-500" />
          <span className="font-bold">{avgRating}</span>
        </div>
      </div>

      {aboutMe && <div className="mb-4 italic text-gray-600">{aboutMe}</div>}
    </div>

    {bio && Array.isArray(bio) && bio.length > 0 && (
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-2 text-lg font-semibold">Bio</h3>
        <ul className="space-y-2">
          {bio.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)
