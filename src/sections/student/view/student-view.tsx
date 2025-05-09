import { cn } from '@/lib/utils'

// import { courseData } from '@/sections/home/data/data'
// import CourseCard from '@/sections/student/_components/course-card'

const StudentView = () => {
  return (
    <div className="px-5 py-2">
      <div className="mt-2">
        <h3 className="text-xl font-bold">Khoá học nổi bật theo tháng</h3>
        <div
          className={cn(
            'mt-10 grid grid-cols-1 gap-2',
            'md:grid-cols-2 md:gap-4',
            'lg:grid-cols-3 lg:gap-6'
          )}
        >
          {/* {courseData?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))} */}
        </div>
      </div>
    </div>
  )
}
export default StudentView
