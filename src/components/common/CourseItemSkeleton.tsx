export const CourseItemSkeleton = () => (
  <div className="course-item hover-img title-small">
    <div className="features image-wrap">
      <div className="h-44 w-full rounded-t-lg bg-gray-300"></div>

      <div className="box-tags">
        <div className="item h-6 w-20 bg-gray-300"></div>
      </div>

      <div className="box-wishlist tf-action-btns size-8 rounded-full bg-gray-300"></div>
    </div>

    <div className="content">
      <div className="meta !gap-0 md:gap-4">
        <div className="meta-item flex items-center !pr-2 md:pr-[10px]">
          <div className="mr-2 size-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-16 rounded bg-gray-300"></div>
        </div>

        <div className="meta-item flex items-center pl-2 md:pl-[10px]">
          <div className="mr-2 size-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-16 rounded bg-gray-300"></div>
        </div>
      </div>

      <div className="my-2 h-6">
        <div className="h-5 w-full rounded bg-gray-300"></div>
      </div>

      <div className="ratings pb-30 flex items-center">
        <div className="mr-2 h-5 w-8 rounded bg-gray-300"></div>
        <div className="stars flex items-center">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="mx-0.5 size-4 rounded-full bg-gray-300"
            ></div>
          ))}
        </div>
        <div className="ml-2 h-4 w-10 rounded bg-gray-300"></div>
      </div>

      <div className="author flex items-center gap-2">
        <div className="size-5 rounded-full bg-gray-300"></div>
        <div className="h-4 w-24 rounded bg-gray-300"></div>
      </div>

      <div className="bottom mt-4 flex items-center justify-between">
        <div className="h6 price fw-5">
          <div className="h-5 w-16 rounded bg-gray-300"></div>
        </div>

        <div className="tf-btn-arrow">
          <div className="h-8 w-24 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  </div>
)
