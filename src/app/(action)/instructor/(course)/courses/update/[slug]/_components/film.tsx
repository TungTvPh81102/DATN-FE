import React from 'react'
import {
  BookOpen,
  Camera,
  Film,
  Glasses,
  Maximize2,
  Mic,
  Monitor,
  PauseCircle,
} from 'lucide-react'

const FilmEditing = () => {
  return (
    <div className="mx-auto p-4">
      <div className="mb-10 border-l-4 border-[#E27447] pl-4">
        <h1 className="text-3xl font-bold text-gray-800">Biên tập</h1>
        <p className="mt-3 leading-relaxed text-gray-600">
          Đây là khoảnh khắc của bạn! Nếu bạn đã xây dựng lộ trình và sử dụng
          hướng dẫn của chúng tôi, bạn đã chuẩn bị tốt cho buổi chụp thực tế.
          Hãy tự điều chỉnh, dành thời gian để làm cho nó vừa phải và tinh chỉnh
          khi bạn chỉnh sửa.
        </p>
      </div>

      <div className="mb-10">
        <div className="mb-6 flex items-center">
          <Glasses className="mr-3 text-[#E27447]" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">
            Mẹo biên tập chuyên nghiệp
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border-t-4 border-blue-500 bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-3 flex items-center">
              <PauseCircle className="mr-2 text-blue-500" size={20} />
              <h3 className="text-lg font-bold">Nghỉ giải lao và xem lại</h3>
            </div>
            <p className="text-gray-600">
              Kiểm tra thường xuyên để xem có bất kỳ thay đổi nào như tiếng ồn
              mới không. Hãy lưu ý đến mức năng lượng của chính bạn - quay phim
              có thể khiến bạn mệt mỏi và điều đó sẽ được thể hiện trên màn
              hình.
            </p>
          </div>

          <div className="rounded-lg border-t-4 border-green-500 bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-3 flex items-center">
              <BookOpen className="mr-2 text-green-500" size={20} />
              <h3 className="text-lg font-bold">Xây dựng mối quan hệ</h3>
            </div>
            <p className="text-gray-600">
              Học viên muốn biết ai đang dạy mình. Ngay cả đối với khóa học chủ
              yếu là screencast, hãy tự quay phim để giới thiệu. Hoặc đi xa hơn
              và tự quay phim giới thiệu từng phần!
            </p>
          </div>

          <div className="rounded-lg border-t-4 border-purple-500 bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-3 flex items-center">
              <Camera className="mr-2 text-purple-500" size={20} />
              <h3 className="text-lg font-bold">
                Luyện tập xuất hiện trước ống kính
              </h3>
            </div>
            <p className="text-gray-600">
              Giao tiếp bằng mắt với máy ảnh và nói rõ ràng. Thực hiện nhiều lần
              quay lại cho đến khi bạn làm đúng.
            </p>
          </div>

          <div className="rounded-lg border-t-4 border-yellow-500 bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-3 flex items-center">
              <Film className="mr-2 text-yellow-500" size={20} />
              <h3 className="text-lg font-bold">Chuẩn bị cho việc biên tập</h3>
            </div>
            <p className="text-gray-600">
              Bạn có thể chỉnh sửa các đoạn dừng dài, lỗi và ừm hoặc à. Quay một
              vài hoạt động hoặc hình ảnh bổ sung mà bạn có thể thêm vào sau để
              che các đoạn cắt đó.
            </p>
          </div>

          <div className="rounded-lg border-t-4 border-red-500 bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-3 flex items-center">
              <Mic className="mr-2 text-red-500" size={20} />
              <h3 className="text-lg font-bold">Tạo dấu âm thanh</h3>
            </div>
            <p className="text-gray-600">
              Vỗ tay khi bạn bắt đầu mỗi lần quay để dễ dàng xác định điểm đột
              biến âm thanh trong quá trình chỉnh sửa. Sử dụng hướng dẫn của
              chúng tôi để quản lý ngày ghi âm của bạn một cách hiệu quả.
            </p>
          </div>

          <div className="rounded-lg border-t-4 border-indigo-500 bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-3 flex items-center">
              <Monitor className="mr-2 text-indigo-500" size={20} />
              <h3 className="text-lg font-bold">Dọn dẹp màn hình</h3>
            </div>
            <p className="text-gray-600">
              Di chuyển các tệp và thư mục không liên quan khỏi màn hình nền và
              mở bất kỳ tab nào trước. Làm cho văn bản trên màn hình có kích
              thước ít nhất 24pt và sử dụng chức năng thu phóng để tô sáng.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#F9DCD2] bg-[#FFF5F1] p-6">
        <div className="mb-4 flex items-center">
          <Maximize2 className="mr-3 text-[#E27447]" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Yêu cầu kỹ thuật</h2>
        </div>

        <ul className="space-y-4">
          <li className="flex items-center rounded bg-white p-3 shadow-sm">
            <div className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E27447] font-bold text-white">
              1
            </div>
            <span className="text-gray-700">
              Âm thanh phải không có tiếng vang và tiếng ồn xung quanh để không
              làm mất tập trung của học sinh
            </span>
          </li>

          <li className="flex items-center rounded bg-white p-3 shadow-sm">
            <div className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E27447] font-bold text-white">
              2
            </div>
            <span className="text-gray-700">
              Quay phim và xuất ra ở chế độ HD để tạo video có độ phân giải ít
              nhất là 720p hoặc 1080p nếu có thể
            </span>
          </li>

          <li className="flex items-center rounded bg-white p-3 shadow-sm">
            <div className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E27447] font-bold text-white">
              3
            </div>
            <span className="text-gray-700">
              Âm thanh phải phát ra từ cả kênh trái và phải và được đồng bộ hóa
              với video của bạn
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default FilmEditing
