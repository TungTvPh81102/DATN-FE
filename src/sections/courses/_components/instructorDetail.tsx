import { IInstructorProfile } from '@/types'
import Link from 'next/link'

type Props = {
  instructorDetail: IInstructorProfile
}

export const InstructorDetail = ({ instructorDetail }: Props) => {
  return (
    <div className="page-instructor">
      <h2 className="text-22 fw-5 wow fadeInUp" data-wow-delay="0s">
        Người hướng dẫn
      </h2>
      <div className="instructors-item style-2">
        <div className="image-wrapper">
          <img
            className="lazyload"
            data-src={instructorDetail?.avatar ?? ''}
            src={instructorDetail?.avatar ?? ''}
            alt={instructorDetail?.name}
          />
        </div>
        <div className="entry-content">
          <h5 className="entry-title">
            <Link href={`/profile/${instructorDetail?.code}`}>
              {instructorDetail?.name}
            </Link>
          </h5>
          <ul className="entry-meta">
            <li>
              <div className="ratings">
                <div className="number">{instructorDetail?.avg_rating}</div>

                {/* Render sao đầy */}
                {Array.from({
                  length: Math.floor(
                    parseFloat(instructorDetail?.avg_rating ?? '') || 0
                  ),
                }).map((_, index) => (
                  <i key={index} className="icon-star-1" />
                ))}

                {Array.from({
                  length:
                    5 -
                    Math.floor(
                      parseFloat(instructorDetail?.avg_rating ?? '') || 0
                    ),
                }).map((_, index) => (
                  <svg
                    key={index}
                    width={12}
                    height={11}
                    viewBox="0 0 12 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.54831 7.10382L3.58894 6.85477L3.41273 6.67416L1.16841 4.37373L4.24914 3.90314L4.51288 3.86286L4.62625 3.62134L5.99989 0.694982L7.37398 3.62182L7.48735 3.86332L7.75108 3.9036L10.8318 4.37419L8.58749 6.67462L8.41128 6.85523L8.4519 7.10428L8.98079 10.3465L6.24201 8.8325L6.00014 8.69879L5.75826 8.83247L3.01941 10.3461L3.54831 7.10382Z"
                      stroke="#131836"
                    />
                  </svg>
                ))}

                <div className="total">315,475 Reviews</div>
              </div>
            </li>
            <li>
              <i className="flaticon-user" />
              {instructorDetail?.total_student} Students
            </li>
            <li>
              <i className="flaticon-play" />
              {instructorDetail?.total_courses} Course
            </li>
          </ul>
          <p className="description">{instructorDetail?.about_me ?? ''}</p>
          <ul className="tf-social-icon flex items-center gap-[10px]">
            <li>
              <a href="#">
                <i className="flaticon-facebook-1" />
              </a>
            </li>
            <li>
              <a href="#">
                <i className="icon-twitter" />
              </a>
            </li>
            <li>
              <a href="#">
                <i className="flaticon-instagram" />
              </a>
            </li>
            <li>
              <a href="#">
                <i className="flaticon-linkedin-1" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
