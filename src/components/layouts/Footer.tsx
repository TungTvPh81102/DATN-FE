import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react'

type ContactInfo = {
  phone: string
  email: string
  address: string
}

const Footer = () => {
  const contactInfo: ContactInfo = {
    phone: '0868313293',
    email: 'coursemely.support@gmail.com',
    address: 'Trịnh Văn Bô, Nam Từ Liêm, TP. Hà Nội',
  }

  const PRIMARY_COLOR = '#E27447'

  return (
    <footer id="footer" className="footer">
      <div className="footer-wrap">
        <div className="footer-body">
          <div className="tf-container">
            <div className="row">
              <div className="col-12">
                <div className="footer-body-wrap flex justify-between">
                  <div
                    className="footer-more-infor wow fadeInUp"
                    data-wow-delay="0s"
                  >
                    <div className="footer-logo">
                      <Link href="/">
                        <Image
                          src="/images/logo/logo.svg"
                          alt=""
                          width={200}
                          height={300}
                        />
                      </Link>
                    </div>
                    <ul className="mb-8 space-y-4">
                      <li className="flex items-center gap-3 text-gray-600">
                        <div
                          className="flex size-9 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${PRIMARY_COLOR}15` }}
                        >
                          <Phone size={16} style={{ color: PRIMARY_COLOR }} />
                        </div>
                        <span>{contactInfo.phone}</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-600">
                        <div
                          className="flex size-9 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${PRIMARY_COLOR}15` }}
                        >
                          <Mail size={16} style={{ color: PRIMARY_COLOR }} />
                        </div>
                        <span>{contactInfo.email}</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-600">
                        <div
                          className="flex size-9 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${PRIMARY_COLOR}15` }}
                        >
                          <MapPin size={16} style={{ color: PRIMARY_COLOR }} />
                        </div>
                        <span>{contactInfo.address}</span>
                      </li>
                    </ul>
                    <div className="flex gap-3">
                      <Link
                        href="#"
                        className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md"
                        style={{ color: PRIMARY_COLOR }}
                      >
                        <Facebook size={18} />
                      </Link>
                      <Link
                        href="#"
                        className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md"
                        style={{ color: PRIMARY_COLOR }}
                      >
                        <Twitter size={18} />
                      </Link>
                      <Link
                        href="#"
                        className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md"
                        style={{ color: PRIMARY_COLOR }}
                      >
                        <Instagram size={18} />
                      </Link>
                      <Link
                        href="#"
                        className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md"
                        style={{ color: PRIMARY_COLOR }}
                      >
                        <Linkedin size={18} />
                      </Link>
                    </div>
                  </div>
                  <div
                    className="footer-menu-list wow fadeInUp"
                    data-wow-delay="0.2s"
                  >
                    <h5 className="fw-5">Về chúng tôi</h5>
                    <ul>
                      <li>
                        <Link href="/about-us">Giới thiệu</Link>
                      </li>
                      <li>
                        <a href="#">Liên hệ</a>
                      </li>
                      <li>
                        <a href="#">Blog</a>
                      </li>
                      <li>
                        <Link href="/terms">Điều khoản</Link>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="footer-menu-list wow fadeInUp"
                    data-wow-delay="0.3s"
                  >
                    <h5 className="fw-5">Chính sách và điều khoản</h5>
                    <ul>
                      <li>
                        <Link href="/terms">Chính sách bảo mật</Link>
                      </li>
                      <li>
                        <Link href="/terms">Điều khoản dịch vụ</Link>
                      </li>
                      <li>
                        <Link href="/terms">Chính sách hoàn tiền</Link>
                      </li>
                      <li>
                        <Link href="/terms">Chính sách xử lý khiếu nại</Link>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="footer-menu-list wow fadeInUp"
                    data-wow-delay="0.4s"
                  >
                    <h5 className="fw-5">Hỗ trợ khách hàng</h5>
                    <ul>
                      <li>
                        <a href="#">Câu hỏi thường gặp</a>
                      </li>
                      <li>
                        <a href="#">Hướng dẫn sử dụng</a>
                      </li>
                      <li>
                        <a href="#">Gửi yêu cầu hỗ trợ</a>
                      </li>
                      <li>
                        <a href="#">Liên hệ bộ phận CSKH</a>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="footer-subscribe wow fadeInUp"
                    data-wow-delay="0.5s"
                  >
                    <h5 className="fw-5">Đăng ký nhận tin</h5>
                    <p className="mb-4 text-sm text-gray-600">
                      Nhận thông báo về các khóa học mới và ưu đãi đặc biệt qua
                      email
                    </p>
                    <form className="mb-8">
                      <div className="flex flex-col space-y-3">
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Email của bạn"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-2"
                            style={{ borderColor: PRIMARY_COLOR }}
                          />
                        </div>
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-all hover:shadow-md"
                          style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                          <span>Đăng ký</span>
                          <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </form>
                    <h5 className="mb-4 text-base font-semibold">
                      Tải ứng dụng
                    </h5>
                    <ul className="tf-app-download">
                      <li>
                        <a href="#">
                          <div className="icon">
                            <i className="icon-apple" />
                          </div>
                          <div className="app">
                            <div>Download on the</div>
                            <div>Apple Store</div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="icon">
                            <i className="icon-chplay" />
                          </div>
                          <div className="app">
                            <div>Get in on</div>
                            <div>Google Play</div>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom wow fadeInUp" data-wow-delay="0s">
          <div className="tf-container">
            <div className="row">
              <div className="col-12">
                <div className="footer-bottom-wrap flex items-center justify-center">
                  <p>
                    ©&nbsp;2025&nbsp;CourseMeLy. Nền tảng học trực tuyến hàng
                    đầu Việt Nam
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
