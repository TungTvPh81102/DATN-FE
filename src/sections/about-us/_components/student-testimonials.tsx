import Image from 'next/image'
import { useState } from 'react'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { IUserRating } from '@/types'

type Props = {
  data: IUserRating[]
}

export const StudentTestimonials = ({ data }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(false)

  console.log('data', data)

  const changeSlide = (newIndex: number) => {
    setFade(true)
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setFade(false)
    }, 300)
  }

  const nextSlide = () => {
    changeSlide((currentIndex + 1) % data.length)
  }

  const prevSlide = () => {
    changeSlide((currentIndex - 1 + data.length) % data.length)
  }

  return (
    <section className="mx-auto max-w-7xl">
      <h2 className="mb-4 text-3xl font-semibold text-gray-800">
        Học viên nói gì về CourseMely
      </h2>
      <section className="relative flex items-center justify-center rounded-lg p-12">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-gray-700 p-2 text-white shadow-md hover:bg-gray-800"
        >
          <ChevronsLeft size={40} />
        </button>
        <div
          className={`grid min-h-[300px] w-full max-w-4xl grid-cols-1 items-center gap-4 rounded-xl bg-gray-50 transition-opacity duration-500 md:grid-cols-2 ${fade ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex flex-col justify-center p-4 text-center md:text-left">
            <p className="text-2xl font-semibold text-gray-800">
              &quot;{data[currentIndex]?.content}&quot;
            </p>
            <h3 className="mt-4 text-lg font-bold text-gray-700">
              {data[currentIndex]?.user?.name}
            </h3>
          </div>
          <div className="flex justify-center">
            <Image
              src={data[currentIndex]?.user?.avatar ?? ''}
              alt={data[currentIndex]?.user?.name}
              width={200}
              height={200}
              className="size-40 rounded-full object-cover"
            />
          </div>
        </div>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-gray-700 p-2 text-white shadow-md hover:bg-gray-800"
        >
          <ChevronsRight size={40} />
        </button>
      </section>
    </section>
  )
}
