import { IUserRating } from '@/types'
import { RatingItem } from '@/sections/courses/_components/rating-item'

type Props = {
  data: IUserRating[]
}

export const RatingsList = ({ data }: Props) => {
  if (data.length === 0)
    return (
      <div>
        <p className="text-center">Hãy viết cảm nghĩ của bạn...</p>
      </div>
    )

  return (
    <div>
      {data?.map((rating) => <RatingItem rating={rating} key={rating.id} />)}
    </div>
  )
}
