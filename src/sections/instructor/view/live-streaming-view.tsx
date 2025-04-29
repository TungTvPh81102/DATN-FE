'use client'

import React, { useState } from 'react'
import {
  AlertCircle,
  Info,
  FileText,
  CheckCircle,
  Clock,
  Users,
  HelpCircle,
  Layers,
  BookOpen,
  BarChart,
  Download,
  ArrowRight,
  Star,
  Mail,
  Phone,
  Calendar,
  MessageCircle,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LiveStreamingView() {
  const [activeTab, setActiveTab] = useState('policies')

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mb-8 bg-gradient-to-r from-[#E27447] via-[#E27447] to-[#e26947] p-8 text-white shadow-lg">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:w-2/3">
              <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                <span>Chào mừng đến với </span>
                <span className="text-white">CourseMeLy Studio</span>
              </h1>
              <p className="mb-6 text-lg text-orange-100 md:pr-8">
                Nền tảng phát trực tuyến và quản lý khóa học hàng đầu cho giảng
                viên, đảm bảo chất lượng và trải nghiệm học tập tuyệt vời cho
                học viên.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/90 text-[#E27447] hover:bg-white">
                  <Star className="mr-1 size-3 text-amber-500" /> Phát trực tiếp
                </Badge>
                <Badge className="bg-white/90 text-[#E27447] hover:bg-white">
                  <BookOpen className="mr-1 size-3 text-amber-500" /> Quản lý
                  khóa học
                </Badge>
                <Badge className="bg-white/90 text-[#E27447] hover:bg-white">
                  <Users className="mr-1 size-3 text-amber-500" /> Tương tác
                  người học
                </Badge>
              </div>
            </div>
            <div className="flex justify-center md:w-1/3">
              <div className="rounded-lg bg-[#c6613c]/50 p-4 backdrop-blur-sm">
                <div className="rounded-md bg-white p-1 text-center text-sm font-medium text-[#E27447]">
                  TRỰC TIẾP NGAY
                </div>
                <div className="mt-3 space-y-2">
                  <button className="flex w-full items-center justify-between rounded-md bg-[#E27447] py-2 pl-3 pr-2 text-sm text-white transition hover:bg-[#d86a3e]">
                    Bắt đầu buổi học <ArrowRight className="size-4" />
                  </button>
                  <Link
                    href="/live-streaming/manage-schedule"
                    className="flex w-full items-center justify-between rounded-md bg-[#c6613c] py-2 pl-3 pr-2 text-sm text-white transition hover:bg-[#b55735]"
                  >
                    Tạo sự kiện <Clock className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 pb-12">
        <Alert className="mb-8 border-2 border-amber-300 bg-amber-50 shadow-sm">
          <AlertCircle className="size-5 text-amber-600" />
          <AlertTitle className="text-lg font-semibold text-amber-800">
            Thông báo quan trọng
          </AlertTitle>
          <AlertDescription className="text-amber-700">
            Cập nhật mới về chính sách nội dung sẽ có hiệu lực từ ngày
            15/05/2025. Vui lòng đọc kỹ để đảm bảo tuân thủ.
          </AlertDescription>
        </Alert>

        <Tabs
          defaultValue="policies"
          value={activeTab}
          onValueChange={handleTabChange}
          className="mb-8"
        >
          <div className="mb-1 flex justify-center">
            <TabsList className="grid w-full max-w-4xl grid-cols-3 gap-1 rounded-xl bg-orange-100 p-1 md:grid-cols-5">
              {[
                {
                  value: 'policies',
                  label: 'Chính sách',
                  icon: <FileText className="mr-2 size-4" />,
                },
                {
                  value: 'guidelines',
                  label: 'Quy định Live',
                  icon: <Users className="mr-2 size-4" />,
                },
                {
                  value: 'faq',
                  label: 'Câu hỏi thường gặp',
                  icon: <HelpCircle className="mr-2 size-4" />,
                },
                {
                  value: 'resources',
                  label: 'Tài nguyên',
                  icon: <Layers className="mr-2 size-4" />,
                },
                {
                  value: 'support',
                  label: 'Hỗ trợ',
                  icon: <Info className="mr-2 size-4" />,
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`flex items-center rounded-lg border-2 ${
                    activeTab === tab.value
                      ? 'border-[#E27447] bg-white text-[#E27447] shadow-md'
                      : 'border-transparent hover:bg-orange-50 hover:text-[#E27447]'
                  } ${tab.value === 'resources' || tab.value === 'support' ? 'hidden md:flex' : ''}`}
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="policies" className="mt-6">
            <Card className="border-blue-100 shadow-md">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center text-blue-800">
                  <FileText className="mr-3 size-6 text-blue-600" />
                  Chính sách và điều khoản sử dụng
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Tìm hiểu về các chính sách và điều khoản của CourseMeLy Studio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                  <h3 className="mb-3 flex items-center text-xl font-medium text-blue-700">
                    <FileText className="mr-2 size-5 text-blue-600" />
                    Chính sách nội dung
                  </h3>
                  <p className="mb-3 text-slate-700">
                    CourseMeLy Studio cam kết duy trì một môi trường học tập an
                    toàn và chất lượng. Mọi nội dung phải tuân thủ các tiêu
                    chuẩn của chúng tôi.
                  </p>
                  <ul className="mt-3 space-y-2 rounded-md bg-blue-50 p-4 text-slate-700">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Không cho phép nội dung vi phạm bản quyền</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Không chứa ngôn từ phản cảm hoặc thù địch</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>
                        Không quảng cáo các sản phẩm không liên quan đến giáo
                        dục
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Nội dung phải mang tính giáo dục và chính xác</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                  <h3 className="mb-3 flex items-center text-xl font-medium text-blue-700">
                    <BarChart className="mr-2 size-5 text-blue-600" />
                    Chính sách thanh toán
                  </h3>
                  <p className="mb-3 text-slate-700">
                    Chi tiết về cách thức thanh toán, phí giao dịch và chu kỳ
                    thanh toán cho giảng viên.
                  </p>
                  <ul className="mt-3 space-y-2 rounded-md bg-blue-50 p-4 text-slate-700">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Thanh toán được xử lý vào ngày 15 hàng tháng</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Phí dịch vụ: 15% trên tổng doanh thu</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Ngưỡng thanh toán tối thiểu: 500.000đ</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Hỗ trợ nhiều phương thức thanh toán</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                  <h3 className="mb-3 flex items-center text-xl font-medium text-blue-700">
                    <Info className="mr-2 size-5 text-blue-600" />
                    Quyền sở hữu trí tuệ
                  </h3>
                  <p className="text-slate-700">
                    Giảng viên giữ toàn quyền sở hữu trí tuệ đối với nội dung
                    của họ. CourseMeLy Studio chỉ được cấp quyền phân phối.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 px-6 py-4">
                <Button className="bg-[#E27447] hover:bg-[#d86a3e]">
                  Xem chi tiết chính sách
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="guidelines" className="mt-6">
            <Card className="border-red-100 shadow-md">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-red-50 to-red-100">
                <CardTitle className="flex items-center text-red-800">
                  <Users className="mr-3 size-6 text-red-600" />
                  Quy định phát trực tiếp
                </CardTitle>
                <CardDescription className="text-red-600">
                  Các hướng dẫn và quy định khi tiến hành buổi học trực tuyến
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                  <h3 className="mb-3 flex items-center text-xl font-medium text-red-700">
                    <Layers className="mr-2 size-5 text-red-600" />
                    Yêu cầu kỹ thuật
                  </h3>
                  <p className="mb-3 text-slate-700">
                    Đảm bảo chất lượng stream tốt nhất cho người học với các yêu
                    cầu sau:
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 rounded-md bg-red-50 p-4 text-slate-700 md:grid-cols-2">
                    <div className="flex items-center rounded-md bg-white p-3 shadow-sm">
                      <div className="mr-3 rounded-full bg-red-100 p-2">
                        <ArrowRight className="size-4 text-red-600" />
                      </div>
                      <span>Tốc độ internet tối thiểu: 5Mbps upload</span>
                    </div>
                    <div className="flex items-center rounded-md bg-white p-3 shadow-sm">
                      <div className="mr-3 rounded-full bg-red-100 p-2">
                        <ArrowRight className="size-4 text-red-600" />
                      </div>
                      <span>Độ phân giải khuyến nghị: 720p (1280x720)</span>
                    </div>
                    <div className="flex items-center rounded-md bg-white p-3 shadow-sm">
                      <div className="mr-3 rounded-full bg-red-100 p-2">
                        <ArrowRight className="size-4 text-red-600" />
                      </div>
                      <span>Tần số khung hình: 30fps</span>
                    </div>
                    <div className="flex items-center rounded-md bg-white p-3 shadow-sm">
                      <div className="mr-3 rounded-full bg-red-100 p-2">
                        <ArrowRight className="size-4 text-red-600" />
                      </div>
                      <span>
                        Âm thanh: Chất lượng rõ ràng, không có tiếng ồn
                      </span>
                    </div>
                  </div>
                </div>

                <Alert className="border-2 border-green-300 bg-green-50">
                  <CheckCircle className="size-5 text-green-600" />
                  <AlertTitle className="text-lg font-semibold text-green-800">
                    Mẹo hay
                  </AlertTitle>
                  <AlertDescription className="text-green-700">
                    Kiểm tra thiết bị và kết nối ít nhất 15 phút trước giờ phát
                    sóng để đảm bảo mọi thứ hoạt động tốt.
                  </AlertDescription>
                </Alert>

                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                  <h3 className="mb-3 flex items-center text-xl font-medium text-red-700">
                    <Users className="mr-2 size-5 text-red-600" />
                    Quy tắc tương tác
                  </h3>
                  <p className="mb-3 text-slate-700">
                    Xây dựng một cộng đồng học tập tích cực và hiệu quả:
                  </p>
                  <ul className="mt-3 space-y-2 rounded-md bg-red-50 p-4 text-slate-700">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Tôn trọng tất cả người tham gia</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Phản hồi câu hỏi trong thời gian hợp lý</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Kiểm duyệt bình luận không phù hợp</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 size-4 text-green-600" />
                      <span>Khuyến khích tương tác tích cực</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-5 shadow transition-all">
                  <h3 className="mb-3 flex items-center text-xl font-medium text-blue-800">
                    <Clock className="mr-2 size-5 text-blue-600" />
                    Thời lượng khuyến nghị
                  </h3>
                  <div className="flex items-center justify-center rounded-md bg-white p-4 shadow-sm">
                    <div className="mr-4 rounded-full bg-blue-100 p-3">
                      <Clock className="size-6 text-blue-600" />
                    </div>
                    <p className="text-lg font-medium text-blue-700">
                      Thời lượng tối ưu cho buổi live: 45-90 phút
                    </p>
                  </div>
                  <p className="mt-3 text-center text-sm text-blue-600">
                    (tùy theo nội dung và đối tượng người học)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 px-6 py-4">
                <Button className="bg-[#E27447] hover:bg-[#d86a3e]">
                  Xem hướng dẫn chi tiết
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-purple-50 to-purple-100">
                <CardTitle className="flex items-center text-purple-800">
                  <HelpCircle className="mr-3 size-6 text-purple-600" />
                  Câu hỏi thường gặp
                </CardTitle>
                <CardDescription className="text-purple-600">
                  Giải đáp các thắc mắc phổ biến khi sử dụng CourseMeLy Studio
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      question:
                        'Làm thế nào để bắt đầu buổi live stream đầu tiên?',
                      answer:
                        "Đăng nhập vào tài khoản, nhấn vào mục 'Phát trực tiếp' trên thanh bên, thiết lập tiêu đề và mô tả, sau đó nhấn 'Bắt đầu phát sóng'.",
                    },
                    {
                      question: 'Tôi có thể lên lịch phát sóng trước không?',
                      answer:
                        "Có, bạn có thể lên lịch phát sóng trước tối đa 30 ngày bằng cách sử dụng tính năng 'Lên lịch' trên menu chính.",
                    },
                    {
                      question: 'Làm thế nào để xem thống kê người xem?',
                      answer:
                        "Vào mục 'Thống kê' trên menu chính, bạn sẽ thấy dữ liệu về số lượng người xem, thời gian xem trung bình và mức độ tương tác.",
                    },
                    {
                      question:
                        'CourseMeLy Studio có hỗ trợ chia sẻ màn hình không?',
                      answer:
                        'Có, bạn có thể chia sẻ toàn bộ màn hình hoặc chỉ một cửa sổ ứng dụng cụ thể trong khi phát sóng.',
                    },
                    {
                      question:
                        'Làm thế nào để tương tác với người xem trong khi live?',
                      answer:
                        'Bạn có thể sử dụng khung chat trực tiếp, tạo thăm dò ý kiến, và trả lời câu hỏi của người xem ngay trong giao diện phát sóng.',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-lg border border-purple-100 bg-white shadow transition-all hover:shadow-md"
                    >
                      <div className="border-b border-purple-100 bg-purple-50 p-4">
                        <h3 className="flex items-center text-lg font-medium text-purple-800">
                          <HelpCircle className="mr-2 size-4 text-purple-600" />
                          {item.question}
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-slate-700">{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 px-6 py-4">
                <Button className="bg-[#E27447] hover:bg-[#d86a3e]">
                  Xem thêm câu hỏi khác
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <Card className="border-emerald-100 shadow-md">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-emerald-100">
                <CardTitle className="flex items-center text-emerald-800">
                  <Layers className="mr-3 size-6 text-emerald-600" />
                  Tài nguyên hữu ích
                </CardTitle>
                <CardDescription className="text-emerald-600">
                  Các công cụ và tài liệu hỗ trợ việc giảng dạy trực tuyến
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: 'Hướng dẫn sử dụng',
                      description:
                        'Tài liệu chi tiết về cách sử dụng tất cả tính năng của CourseMeLy Studio',
                      icon: <FileText className="size-8 text-blue-500" />,
                      color: 'bg-blue-50',
                      iconBg: 'bg-blue-100',
                      textColor: 'text-blue-700',
                    },
                    {
                      title: 'Mẫu slides',
                      description:
                        'Các mẫu slide chuyên nghiệp để sử dụng trong buổi giảng dạy',
                      icon: <FileText className="size-8 text-purple-500" />,
                      color: 'bg-purple-50',
                      iconBg: 'bg-purple-100',
                      textColor: 'text-purple-700',
                    },
                    {
                      title: 'Thư viện hình ảnh',
                      description:
                        'Kho hình ảnh miễn phí bản quyền để sử dụng trong tài liệu giảng dạy',
                      icon: <FileText className="size-8 text-green-500" />,
                      color: 'bg-green-50',
                      iconBg: 'bg-green-100',
                      textColor: 'text-green-700',
                    },
                    {
                      title: 'Công cụ tạo quiz',
                      description:
                        'Tạo các bài kiểm tra trực tuyến tương tác cho học viên',
                      icon: <FileText className="size-8 text-red-500" />,
                      color: 'bg-red-50',
                      iconBg: 'bg-red-100',
                      textColor: 'text-red-700',
                    },
                    {
                      title: 'Bảng kế hoạch khóa học',
                      description:
                        'Mẫu lập kế hoạch chi tiết cho khóa học của bạn',
                      icon: <FileText className="size-8 text-amber-500" />,
                      color: 'bg-amber-50',
                      iconBg: 'bg-amber-100',
                      textColor: 'text-amber-700',
                    },
                    {
                      title: 'Hướng dẫn SEO',
                      description:
                        'Tối ưu hóa khóa học để tăng khả năng hiển thị trên công cụ tìm kiếm',
                      icon: <FileText className="size-8 text-teal-500" />,
                      color: 'bg-teal-50',
                      iconBg: 'bg-teal-100',
                      textColor: 'text-teal-700',
                    },
                  ].map((resource, index) => (
                    <div
                      key={index}
                      className={`flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md`}
                    >
                      <div className={`p-4 ${resource.color}`}>
                        <div
                          className={`mb-2 rounded-full ${resource.iconBg} inline-flex p-3`}
                        >
                          {resource.icon}
                        </div>
                        <h3
                          className={`mb-1 text-lg font-medium ${resource.textColor}`}
                        >
                          {resource.title}
                        </h3>
                      </div>
                      <div className="grow p-4">
                        <p className="text-sm text-slate-600">
                          {resource.description}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3">
                        <button
                          className={`flex w-full items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700`}
                        >
                          <Download className="mr-2 size-4" /> Tải xuống
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 px-6 py-4">
                <Button className="bg-[#E27447] hover:bg-[#d86a3e]">
                  Xem tất cả tài nguyên
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <Card className="border-indigo-100 shadow-md">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-indigo-100">
                <CardTitle className="flex items-center text-indigo-800">
                  <Info className="mr-3 size-6 text-indigo-600" />
                  Hỗ trợ kỹ thuật
                </CardTitle>
                <CardDescription className="text-indigo-600">
                  Thông tin liên hệ và trợ giúp
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
                    <div className="p-5">
                      <h3 className="mb-4 text-xl font-medium text-indigo-700">
                        Liên hệ với chúng tôi
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center rounded-md bg-white p-4 shadow-sm">
                          <div className="mr-4 rounded-full bg-indigo-100 p-3">
                            <Mail className="size-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Email</p>
                            <p className="font-medium text-indigo-700">
                              support@coursemely.vn
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center rounded-md bg-white p-4 shadow-sm">
                          <div className="mr-4 rounded-full bg-indigo-100 p-3">
                            <Phone className="size-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Hotline</p>
                            <p className="font-medium text-indigo-700">
                              1900 123 456
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center rounded-md bg-white p-4 shadow-sm">
                        <div className="mr-4 rounded-full bg-indigo-100 p-3">
                          <Clock className="size-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Giờ làm việc</p>
                          <p className="font-medium text-indigo-700">
                            8:00 - 18:00, Thứ Hai - Thứ Bảy
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                      <div className="border-b border-slate-100 bg-slate-50 p-4">
                        <h3 className="flex items-center text-lg font-medium text-indigo-700">
                          <Calendar className="mr-2 size-5 text-indigo-600" />
                          Đặt lịch hỗ trợ 1:1
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="mb-4 text-slate-700">
                          Đặt lịch hẹn với đội ngũ hỗ trợ kỹ thuật để nhận trợ
                          giúp trực tiếp về các vấn đề của bạn.
                        </p>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                          Đặt lịch ngay
                        </Button>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                      <div className="border-b border-slate-100 bg-slate-50 p-4">
                        <h3 className="flex items-center text-lg font-medium text-indigo-700">
                          <MessageCircle className="mr-2 size-5 text-indigo-600" />
                          Live chat
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="mb-4 text-slate-700">
                          Trò chuyện trực tiếp với bộ phận hỗ trợ của chúng tôi
                          để nhận giải đáp nhanh chóng cho các thắc mắc.
                        </p>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Bắt đầu chat
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Alert className="border-2 border-amber-300 bg-amber-50">
                    <Info className="size-5 text-amber-600" />
                    <AlertTitle className="text-lg font-semibold text-amber-800">
                      Thời gian phản hồi
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Chúng tôi cam kết phản hồi email trong vòng 24 giờ và tin
                      nhắn chat trong vòng 2 giờ làm việc.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 px-6 py-4">
                <Button className="bg-[#E27447] hover:bg-[#d86a3e]">
                  Gửi yêu cầu hỗ trợ
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
