import React, { useState } from 'react'

const BlogListSideBar = () => {
  const [searchText, setSearchText] = useState('')

  const [openSections, setOpenSections] = useState({
    categories: true,
    recentPosts: false,
    tags: false,
  })

  const toggleSection = (section: 'categories' | 'recentPosts' | 'tags') => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="right tf-sidebar rounded-lg bg-white p-6">
      <div className="sidebar-search mb-8">
        <form action="#" className="form-search relative">
          <input
            className="w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2"
            type="text"
            placeholder="Tìm kiếm bài viết..."
            name="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-required="true"
            required
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300 hover:text-[#E78E6A]"
            type="submit"
          >
            <i className="icon-search text-xl"></i>
          </button>
        </form>
      </div>

      <div className="sidebar-item sidebar-categories mb-8 border-b border-gray-200 pb-6">
        <div
          className="sidebar-title mb-4 flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection('categories')}
        >
          <h5 className="text-xl font-medium">Danh mục</h5>
          <i
            className={`transition-transform duration-300 ${openSections.categories ? 'rotate-0' : 'rotate-180'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
            </svg>
          </i>
        </div>
        {openSections.categories && (
          <ul className="space-y-3">
            {[
              { name: 'Web Development', count: 432 },
              { name: 'Software Testing', count: 12 },
              { name: 'Mobile Development', count: 324 },
              { name: 'Game Development', count: 87 },
              { name: 'Software Engineering', count: 163 },
            ].map((category, index) => (
              <li
                key={index}
                className="group flex items-center justify-between"
              >
                <a
                  href="#"
                  className="flex items-center text-gray-700 transition-colors duration-300 group-hover:text-[#E78E6A]"
                >
                  <span className="mr-2">•</span>
                  {category.name}
                </a>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-600 transition-all group-hover:bg-[#E78E6A] group-hover:text-white">
                  {category.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-item sidebar-recent mb-8 border-b border-gray-200 pb-6">
        <div
          className="sidebar-title mb-4 flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection('recentPosts')}
        >
          <h5 className="text-xl font-medium">Bài viết gần đây</h5>
          <i
            className={`transition-transform duration-300 ${openSections.recentPosts ? 'rotate-0' : 'rotate-180'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
            </svg>
          </i>
        </div>
        {openSections.recentPosts && (
          <ul>
            {[
              {
                title: 'Why Is Education So Famous?',
                date: '06 April 2024',
                image: '/assets/images/blog/blog-05.jpg',
              },
              {
                title: 'Difficult Things About Education.',
                date: '06 April 2024',
                image: '/assets/images/blog/blog-12.jpg',
              },
              {
                title: 'Why Is Education So Famous?',
                date: '06 April 2024',
                image: '/assets/images/blog/blog-03.jpg',
              },
            ].map((post, index) => (
              <li
                key={index}
                className="group flex space-x-4 rounded p-2 transition-all duration-300 hover:bg-gray-50"
              >
                <div className="image-wrap size-16 shrink-0 overflow-hidden rounded">
                  <img
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={post.image}
                    alt={post.title}
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <a
                    href="blog-single.html"
                    className="line-clamp-2 font-medium text-gray-800 transition-colors group-hover:text-[#E78E6A]"
                  >
                    {post.title}
                  </a>
                  <p className="mt-1 flex items-center text-sm text-gray-500">
                    {post.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-item">
        <div
          className="sidebar-title mb-4 flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection('tags')}
        >
          <h5 className="text-xl font-medium">Thẻ phổ biến</h5>
          <i
            className={`transition-transform duration-300 ${openSections.tags ? 'rotate-0' : 'rotate-180'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
            </svg>
          </i>
        </div>
        {openSections.tags && (
          <div className="flex flex-wrap gap-2">
            {[
              'Course',
              'SEO',
              'Designer',
              'Software',
              'Java',
              'CSS',
              'ReactJS',
              'NodeJS',
            ].map((tag, index) => (
              <a
                key={index}
                href="#"
                className="rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition-colors duration-300 hover:bg-[#E78E6A] hover:text-white"
              >
                {tag}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogListSideBar
