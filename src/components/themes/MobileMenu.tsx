// 'use client'
//
// import { useEffect } from 'react'
// import Link from 'next/link'
// import Mmenu from 'mmenu-js'
//
// const MobileMenu = () => {
//   useEffect(() => {
//     const menuElement = document.querySelector('#menu') as HTMLElement
//     if (menuElement) {
//       new Mmenu(menuElement)
//     }
//   }, [])
//   return (
//     <nav className="d-lg-none" id="menu">
//       <a className="close" aria-label="Close menu" href="#wrapper">
//         <i className="flaticon-close-1"></i>
//       </a>
//       <ul>
//         <li>
//           <span>Categories</span>
//           <ul>
//             <li>
//               <span>Graphics & Design</span>
//               <ul>
//                 <li>
//                   <Link href="#">Human Resources</Link>
//                 </li>
//                 <li>
//                   <Link href="#">Operations</Link>
//                 </li>
//                 <li>
//                   <Link href="#">Supply Chain Management</Link>
//                 </li>
//                 <li>
//                   <Link href="#">Customer Service</Link>
//                 </li>
//                 <li>
//                   <Link href="#">Manufacturing</Link>
//                 </li>
//                 <li>
//                   <Link href="#">Health And Safety</Link>
//                 </li>
//               </ul>
//             </li>
//           </ul>
//         </li>
//       </ul>
//     </nav>
//   )
// }
// export default MobileMenu
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Mmenu from 'mmenu-js'
import { useGetCategories } from '@/hooks/category/useCategory'
import { ICategory } from '@/types/Category'
import { useRouter } from 'next/navigation'

const MobileMenu = () => {
  const { data: categoryData } = useGetCategories()
  const router = useRouter()

  useEffect(() => {
    const menuElement = document.querySelector('#menu') as HTMLElement
    if (menuElement) {
      new Mmenu(menuElement)
    }
  }, [])

  const handleCategorySelect = (categorySlug: string) => {
    const updatedFilters = { categories: [categorySlug] }
    localStorage.setItem('courseFilters', JSON.stringify(updatedFilters))
    window.dispatchEvent(new Event('courseFiltersUpdated'))
    router.push('/courses')
  }

  return (
    <nav className="d-lg-none" id="menu">
      <a className="close" aria-label="Close menu" href="#wrapper">
        <i className="flaticon-close-1"></i>
      </a>
      <ul>
        <li>
          <Link href="/">Trang chủ</Link>
        </li>
        <li>
          <span>Danh mục</span>
          <ul>
            {categoryData?.data?.map((category: ICategory) => (
              <li key={category.id}>
                <Link
                  href={`/course/${category?.slug}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleCategorySelect(category?.slug)
                  }}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <Link href="/courses">Khoá học</Link>
        </li>
        <li>
          <Link href="/blogs">Bài viết</Link>
        </li>
      </ul>
    </nav>
  )
}

export default MobileMenu
