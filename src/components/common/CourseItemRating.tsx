type Props = {
  count: number
  average: number
}

export const CourseItemRating = ({ count, average }: Props) => (
  <div className="ratings pb-30">
    {count > 0 ? (
      <>
        <div className="stars flex items-center">
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={`icon-star-1 ${
                index < Math.round(average)
                  ? 'text-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="total text-sm text-gray-500">({count})</div>
      </>
    ) : (
      <div className="mb-2 text-sm text-gray-500">Chưa có lượt đánh giá</div>
    )}
  </div>
)
