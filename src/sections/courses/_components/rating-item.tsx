import Image from 'next/image'
import { IUserRating } from '@/types'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'next/navigation'
import { timeAgo } from '@/lib/common'
import { useMemo } from 'react'

type Props = {
  rating: IUserRating
}

export const RatingItem = ({ rating }: Props) => {
  const totalStars = 5
  const filledStars = useMemo(
    () => Math.floor(rating?.rate ?? 0),
    [rating?.rate]
  )

  const { user } = useAuthStore()
  const router = useRouter()

  const handleNavigate = () => {
    const targetPath =
      user?.code === rating?.user?.code
        ? '/me'
        : `/profile/${rating?.user?.code}`
    router.push(targetPath)
  }

  return (
    <div className="review-item">
      <div className="avatar relative">
        <Image
          className="ls-is-cached lazyloaded rounded-full object-contain"
          data-src={rating?.user?.avatar}
          src={rating?.user?.avatar ?? ''}
          alt=""
          fill
        />
      </div>
      <div className="comment-box">
        <h5 className="author-name">
          {' '}
          <a
            href={`/profile/${rating?.user?.code}`}
            onClick={(e) => {
              e.preventDefault()
              handleNavigate()
            }}
          >
            {rating?.user?.name}
          </a>
        </h5>
        <div className="ratings">
          <div className="number">{rating?.rate}</div>
          {[...Array(totalStars)].map((_, i) =>
            i < filledStars ? (
              <i className="icon-star-1" key={i} />
            ) : (
              <svg
                width={12}
                height={11}
                viewBox="0 0 12 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                key={i}
              >
                <path
                  d="M3.54831 7.10382L3.58894 6.85477L3.41273 6.67416L1.16841 4.37373L4.24914 3.90314L4.51288 3.86286L4.62625 3.62134L5.99989 0.694982L7.37398 3.62182L7.48735 3.86332L7.75108 3.9036L10.8318 4.37419L8.58749 6.67462L8.41128 6.85523L8.4519 7.10428L8.98079 10.3465L6.24201 8.8325L6.00014 8.69879L5.75826 8.83247L3.01941 10.3461L3.54831 7.10382ZM11.0444 4.15626L11.0442 4.15651L11.0444 4.15626Z"
                  stroke="#131836"
                />
              </svg>
            )
          )}

          <div className="total">{timeAgo(rating?.created_at ?? '')}</div>
        </div>
        <p className="comment">{rating?.content}</p>
      </div>
    </div>
  )
}
