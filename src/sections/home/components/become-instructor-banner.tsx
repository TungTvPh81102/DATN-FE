import Image from 'next/image'
import Link from 'next/link'

const BecomeInstructorBanner = () => {
  return (
    <section
      className="section-become-instructor wow fadeInUp mb-12 pt-0"
      data-wow-delay="0.2s"
    >
      <div className="tf-container">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-section">
              <div className="content-inner">
                <h2 className="fw-7">Bắt đầu để trở thành giảng viên</h2>

                <p className="fs-15">
                  Hãy trở thành giảng viên và bắt đầu chia sẻ kiến thức của bạn
                  đến với mọi người. Tham gia ngay để khám phá tiềm năng của
                  bạn!
                </p>

                <ul className="wrap-list-text-check1">
                  <li>
                    <i className="icon-check" />
                    Earn money
                  </li>

                  <li>
                    <i className="icon-check" />
                    Inspire students
                  </li>

                  <li>
                    <i className="icon-check" />
                    Join our community
                  </li>
                </ul>
              </div>

              <div className="content-user">
                <div className="box-agent style2">
                  <ul className="agent-img-list">
                    <li className="agent-img-item">
                      <Image
                        width={40}
                        height={40}
                        className="lazyload"
                        data-src="/assets/images/avatar/user-1.png"
                        src="/assets/images/avatar/user-1.png"
                        alt=""
                      />
                    </li>

                    <li className="agent-img-item">
                      <Image
                        width={40}
                        height={40}
                        className="lazyload"
                        data-src="/assets/images/avatar/user-2.png"
                        src="/assets/images/avatar/user-2.png"
                        alt=""
                      />
                    </li>

                    <li className="agent-img-item">
                      <Image
                        width={40}
                        height={40}
                        className="lazyload"
                        data-src="/assets/images/avatar/user-3.png"
                        src="/assets/images/avatar/user-3.png"
                        alt=""
                      />
                    </li>

                    <li className="agent-img-item">
                      <p>1M+</p>
                    </li>
                  </ul>

                  <Link href="#" className="tf-btn">
                    Đăng ký ngay
                    <i className="icon-arrow-top-right" />
                  </Link>
                </div>
              </div>
              <div className="content-img">
                <Image
                  width={354}
                  height={401}
                  className="lazyload item-1"
                  data-src="/assets/images/section/become-instructor-1.png"
                  src="/assets/images/section/become-instructor-1.png"
                  alt=""
                />
                <Image
                  width={74}
                  height={79}
                  className="lazyload item-2"
                  data-src="/assets/images/item/item-4.png"
                  src="/assets/images/item/item-4.png"
                  alt=""
                />
                <Image
                  width={64}
                  height={64}
                  className="lazyload item-3"
                  data-src="/assets/images/item/item-20.png"
                  src="/assets/images/item/item-20.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default BecomeInstructorBanner
