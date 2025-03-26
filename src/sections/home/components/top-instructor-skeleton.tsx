export const InstructorItemSkeleton = () => (
  <div className="instructors-item hover-img style-column">
    <div className="image-wrap">
      <div className="size-[260px] bg-gray-300"></div>
    </div>

    <div className="entry-content">
      <ul className="entry-meta">
        <li className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-20 rounded bg-gray-300"></div>
        </li>
        <li className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-20 rounded bg-gray-300"></div>
        </li>
      </ul>

      <div className="my-2 h-6 w-full rounded bg-gray-300"></div>
      <div className="h-4 w-full rounded bg-gray-300"></div>

      <div className="ratings mt-2 flex items-center gap-2">
        <div className="h-5 w-8 rounded bg-gray-300"></div>
        <div className="size-4 rounded-full bg-gray-300"></div>
      </div>
    </div>
  </div>
)
