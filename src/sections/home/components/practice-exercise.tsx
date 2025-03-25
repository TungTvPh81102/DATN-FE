import Link from 'next/link'
import { useGetPracticeExercises } from '@/hooks/course/useCourse'

type Props = {
  title: string
  description: string
}

export const PracticeExercise = ({ title, description }: Props) => {
  const { data, isLoading } = useGetPracticeExercises()

  console.log('data', data)
  console.log('isLoading', isLoading)

  return (
    <section className="section-instructor tf-spacing-2 pt-0">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section">
              <h2 className="fw-7 wow fadeInUp" data-wow-delay="0s">
                {title}
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-[10px]">
                <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.1s">
                  {description}
                </div>

                <Link
                  href="/courses"
                  className="tf-btn-arrow wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  Xem thêm <i className="icon-arrow-top-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
