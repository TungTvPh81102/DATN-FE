export const PostItemSkeleton = () => (
  <div className="blog-article-item hover-img">
    <div className="article-thumb image-wrap">
      <div className="h-[260px] w-[329px] bg-gray-300"></div>
    </div>
    <div className="article-content">
      <div className="article-label h-6 w-24 rounded bg-gray-300"></div>
      <div className="my-2 h-6 w-full rounded bg-gray-300"></div>
      <div className="h-4 w-full rounded bg-gray-300"></div>
      <div className="meta mt-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-16 rounded bg-gray-300"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-16 rounded bg-gray-300"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-16 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  </div>
)
