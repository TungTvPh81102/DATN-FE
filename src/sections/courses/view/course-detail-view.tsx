import { cn, formatMinutesToHour } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  chapterData,
  courseData,
  lessonData,
} from '@/sections/courses/data/data'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Book, CirclePlay, Clock5, Heart } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

const CourseDetailView = ({ slug }: { slug: string }) => {
  console.log(slug)

  const benefitsCoulumn1 = courseData.benefits?.slice(
    0,
    Math.ceil(courseData.benefits.length / 2)
  )
  const benefitsCoulumn2 = courseData.benefits?.slice(
    Math.ceil(courseData.benefits.length / 2)
  )

  const requirementsCoulumn1 = courseData.requirements?.slice(
    0,
    Math.ceil(courseData.requirements.length / 2)
  )
  const requirementsCoulumn2 = courseData.requirements?.slice(
    Math.ceil(courseData.requirements.length / 2)
  )

  return (
    <div className={cn('mx-auto max-w-screen-xl')}>
      <div className="mb-10 mt-7">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/course">Khoá học</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary">
                Khoá học ReactJS cơ bản cho người mới bắt đầu
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <h1 className="text-2xl font-bold">
            Khoá học ReactJS cơ bản cho người mới bắt đầu
          </h1>
          <div className="mt-4 flex items-center gap-2">
            <div className="relative">
              <Avatar className="border-2 border-[#FF6652]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 left-1/2 flex size-5 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-[#FF6652] text-xs font-bold text-white">
                +
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-medium">Văn Tùng</span>
              <span className="text-[14px] font-medium text-[#667085]">
                Tham gia 2021
              </span>
            </div>
          </div>
          <p className="mt-6 leading-8">
            Khóa học ReactJS từ cơ bản tới nâng cao, kết quả của khóa học này là
            bạn có thể làm hầu hết các dự án thường gặp với ReactJS. Cuối khóa
            học này bạn sẽ sở hữu một dự án giống Tiktok.com, bạn có thể tự tin
            đi xin việc khi nắm chắc các kiến thức được chia sẻ trong khóa học
            này.
          </p>
          <div className="mt-8">
            <h3 className="text-xl font-bold">Bạn sẽ học được gì?</h3>
            <div className="grid grid-cols-2">
              <div>
                {benefitsCoulumn1?.map((benefit, index) => (
                  <div key={index} className="mt-5 flex gap-2">
                    <Checkbox className="size-5 rounded" checked={true} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <div>
                {benefitsCoulumn2?.map((benefit, index) => (
                  <div key={index} className="mt-5 flex gap-2">
                    <Checkbox className="size-5 rounded" checked={true} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="my-8">
            <h2 className="text-2xl font-bold">Nội dung khoá học</h2>
            <div className="mt-5">
              {chapterData?.map((chapter, chapterIndex) => (
                <Accordion
                  type="single"
                  collapsible
                  key={chapterIndex}
                  className="mb-6"
                >
                  <AccordionItem value={`item-${chapter.id}`}>
                    <AccordionTrigger className="rounded-lg">
                      {chapter.title}
                    </AccordionTrigger>
                    <AccordionContent className="rounded-lg">
                      {lessonData
                        ?.filter((lesson) => lesson.chapterId === chapter.id)
                        .map((lesson, lessonIndex) => (
                          <div
                            className="mb-5 flex items-center gap-2 border-b border-dashed pb-5 text-sm font-medium last:mb-0 last:border-b-0 last:pb-0"
                            key={lessonIndex}
                          >
                            <CirclePlay />
                            {lesson.content}
                            <span className="ml-auto shrink-0 text-xs font-semibold">
                              0 phút
                            </span>
                          </div>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Yêu cầu</h2>
            <div className="grid grid-cols-2">
              <div>
                {requirementsCoulumn1?.map((requirement, index) => (
                  <div key={index} className="mt-5 flex gap-2">
                    <Checkbox className="size-5 rounded" checked={true} />
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>
              <div>
                {requirementsCoulumn2?.map((requirement, index) => (
                  <div key={index} className="mt-5 flex gap-2">
                    <Checkbox className="size-5 rounded" checked={true} />
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-[60px] mt-8">
            <h2 className="text-xl font-bold">Câu hỏi thường gặp</h2>
            <div className="mt-5">
              <Accordion type="single" collapsible>
                {courseData.qa?.map((faq, faqIndex) => (
                  <AccordionItem
                    value={`item-${faqIndex}`}
                    key={faqIndex}
                    className="mb-6 rounded"
                  >
                    <AccordionTrigger className="rounded-lg">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="rounded-lg">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div>
            <CardContent className="flex flex-col rounded-md p-6 shadow-custom">
              <div className="relative h-60">
                <Image
                  src={courseData.thumbnail!}
                  alt={courseData.name}
                  fill
                  className="rounded-md"
                />

                <span className="absolute right-3 top-3 rounded bg-white px-[10px] py-[6px] text-sm font-medium text-[#667085]">
                  {courseData.level}
                </span>
              </div>

              <div className="mt-6 flex gap-4 text-base font-semibold text-primary">
                {courseData.priceSale && <span>{courseData.priceSale} đ</span>}
                <span
                  className={cn(
                    courseData.priceSale && 'text-[#4D5756] line-through'
                  )}
                >
                  {courseData.price} đ
                </span>
              </div>

              <div className="mt-2">
                <h3 className="text-base font-semibold">Khoá học bao gồm:</h3>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-[#101828]">
                    <Clock5 size="24" />
                    <span className="text-sm font-semibold">
                      Thời lượng {formatMinutesToHour(courseData.duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#101828]">
                    <CirclePlay size="24" />
                    <span className="text-sm font-semibold">
                      Tổng số bài học 50
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#101828]">
                    <Book size="24" />
                    <span className="text-sm font-semibold">
                      Có tài liệu đính kèm
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/course/${courseData.slug}`}
                  className={cn(
                    buttonVariants({ variant: 'default' }),
                    'h-[42px] w-[306px]'
                  )}
                >
                  Mua khoá học
                </Link>
                <div
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-md ' +
                      'hover:bg-primary hover:text-white'
                  )}
                >
                  <Heart />
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailView
