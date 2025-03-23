import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Info, CheckCircle, Wallet, Shield, Clock, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

type MembershipPolicyDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DialogMembershipPolicy = ({
  open,
  onOpenChange,
}: MembershipPolicyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
          <Info size={16} />
          Chính sách đăng ký
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chính sách đăng ký gói thành viên
          </DialogTitle>
          <DialogDescription>
            Thông tin về quyền lợi, tỷ lệ chia sẻ doanh thu và điều khoản đăng
            ký gói thành viên
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Tỷ lệ chia sẻ doanh thu
            </h3>
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      60%
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Giảng viên</p>
                      <p className="text-xs text-muted-foreground">
                        Phần thu nhập của bạn
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-gray-500">40%</div>
                    <div className="text-sm">
                      <p className="font-medium">Hệ thống</p>
                      <p className="text-xs text-muted-foreground">
                        Phí duy trì nền tảng
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Wallet className="mt-1 text-green-600" size={24} />
                <div>
                  <h3 className="font-semibold text-green-700 dark:text-green-400">
                    Thanh toán tức thì vào ví
                  </h3>
                  <p className="mt-1 text-sm">
                    Khác với các nền tảng khác, doanh thu từ các gói membership
                    sẽ được chuyển <strong>trực tiếp và ngay lập tức</strong>{' '}
                    vào ví của giảng viên ngay khi phát sinh giao dịch, không
                    cần chờ đợi chu kỳ thanh toán.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-white dark:bg-gray-800"
                    >
                      Không cần chờ đợi
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white dark:bg-gray-800"
                    >
                      Tự động 100%
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white dark:bg-gray-800"
                    >
                      Minh bạch
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Quyền lợi của giảng viên
            </h3>
            <div className="space-y-2.5">
              {[
                'Tiếp cận đến cộng đồng học viên rộng lớn trên nền tảng',
                'Công cụ quản lý và phân tích dữ liệu học viên chi tiết',
                'Được hỗ trợ về mặt kỹ thuật và tiếp thị khóa học',
                'Doanh thu được chuyển trực tiếp vào ví ngay khi phát sinh',
                'Quyền tự quyết định về nội dung và cách thức giảng dạy',
                'Khả năng tạo nhiều gói thành viên với các mức giá khác nhau',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle size={18} className="mt-0.5 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Yêu cầu khi đăng ký gói thành viên
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="mb-1 font-medium">1. Yêu cầu về nội dung</h4>
                <p className="text-sm text-muted-foreground">
                  Nội dung khóa học phải đáp ứng các tiêu chuẩn chất lượng,
                  không vi phạm bản quyền và phù hợp với chính sách cộng đồng
                  của nền tảng.
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-medium">2. Tương tác với học viên</h4>
                <p className="text-sm text-muted-foreground">
                  Giảng viên cần phản hồi thắc mắc của học viên trong vòng 48
                  giờ và cam kết hỗ trợ học viên trong suốt thời gian họ đăng ký
                  gói thành viên.
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-medium">3. Cập nhật nội dung</h4>
                <p className="text-sm text-muted-foreground">
                  Giảng viên cần định kỳ cập nhật và bổ sung nội dung mới cho
                  khóa học ít nhất 3 tháng/lần để đảm bảo tính cập nhật và giá
                  trị cho người học.
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-medium">4. Chính sách hoàn tiền</h4>
                <p className="text-sm text-muted-foreground">
                  Học viên có quyền yêu cầu hoàn tiền trong vòng 7 ngày đầu sau
                  khi đăng ký nếu nội dung không đáp ứng được mô tả khóa học.
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-medium">5. Chứng nhận và xác minh</h4>
                <p className="text-sm text-muted-foreground">
                  Giảng viên cần cung cấp thông tin xác minh danh tính và chứng
                  chỉ/bằng cấp liên quan đến lĩnh vực giảng dạy trước khi tạo
                  gói thành viên.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Wallet size={20} className="text-blue-500" />
              Hệ thống ví thanh toán
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center p-4 text-center">
                  <Shield className="my-2 text-blue-500" size={28} />
                  <h4 className="mb-1 font-medium">An toàn & Bảo mật</h4>
                  <p className="text-sm text-muted-foreground">
                    Hệ thống ví được mã hóa và bảo vệ bằng công nghệ tiên tiến,
                    đảm bảo an toàn cho tài sản của giảng viên.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center p-4 text-center">
                  <Clock className="my-2 text-blue-500" size={28} />
                  <h4 className="mb-1 font-medium">Thanh toán tức thì</h4>
                  <p className="text-sm text-muted-foreground">
                    Mọi giao dịch được xử lý tự động và tiền được chuyển ngay
                    lập tức vào ví của giảng viên khi có đăng ký mới.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center p-4 text-center">
                  <Award className="my-2 text-blue-500" size={28} />
                  <h4 className="mb-1 font-medium">Rút tiền linh hoạt</h4>
                  <p className="text-sm text-muted-foreground">
                    Giảng viên có thể rút tiền từ ví về tài khoản ngân hàng bất
                    kỳ lúc nào, không giới hạn số lần và số tiền tối thiểu.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-lg font-semibold">Quy trình thanh toán</h3>
            <div className="space-y-4">
              <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                <h4 className="mb-2 font-medium text-green-600 dark:text-green-400">
                  Thanh toán tức thì vào ví
                </h4>
                <p className="text-sm">
                  <strong>Khác biệt hoàn toàn</strong> so với các nền tảng khác,
                  khi học viên đăng ký gói membership, 80% doanh thu sẽ được
                  chuyển <strong>ngay lập tức</strong> vào ví của giảng viên
                  trong hệ thống, không cần đợi đến cuối tháng.
                </p>
              </div>

              <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                <h4 className="mb-2 font-medium">Quy trình rút tiền</h4>
                <ol className="list-inside list-decimal space-y-2 text-sm">
                  <li>
                    Truy cập vào phần &quot;Ví của tôi&quot; trong trang quản lý
                  </li>
                  <li>
                    Chọn số tiền muốn rút (không giới hạn số tiền tối thiểu)
                  </li>
                  <li>
                    Chọn phương thức nhận tiền (chuyển khoản ngân hàng, ví điện
                    tử)
                  </li>
                  <li>Xác nhận yêu cầu rút tiền</li>
                  <li>Tiền sẽ được chuyển trong vòng 24 giờ làm việc</li>
                </ol>
              </div>

              <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                <h4 className="mb-2 font-medium">Phương thức rút tiền</h4>
                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Chuyển khoản ngân hàng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Ví Momo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Ví ZaloPay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>VNPay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>PayPal (dành cho giảng viên quốc tế)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)}>Đã hiểu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
