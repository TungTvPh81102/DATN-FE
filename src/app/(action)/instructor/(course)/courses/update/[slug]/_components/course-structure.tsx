import React from 'react'

const CourseStructure = () => {
  return (
    <div className="mx-auto p-4">
      <div className="mb-10 border-l-4 border-[#E27447] pl-4">
        <h3 className="text-xl font-bold">Cấu trúc</h3>
        <p className="mt-2 text-sm font-normal">
          Lên kế hoạch cẩn thận cho khóa học của bạn sẽ tạo ra lộ trình học tập
          rõ ràng cho học viên và giúp bạn sau khi quay phim. Hãy suy nghĩ về
          các chi tiết của từng bài giảng bao gồm kỹ năng bạn sẽ dạy, độ dài
          video ước tính, các hoạt động thực hành cần đưa vào và cách bạn sẽ tạo
          phần giới thiệu và tóm tắt.
        </p>
      </div>

      <div className="mt-4">
        <div className="mb-6 flex items-center">
          <h3 className="text-xl font-bold">Mẹo</h3>
        </div>

        <div className="space-y-8">
          <div className="rounded-lg border-t-4 border-[#E27447] bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <h4 className="font-bold">Bắt đầu với mục tiêu của bạn.</h4>
            <p className="mt-2 text-sm font-normal">
              Việc đặt ra mục tiêu về những gì người học sẽ đạt được trong khóa
              học của bạn (còn gọi là mục tiêu học tập) ngay từ đầu sẽ giúp bạn
              xác định nội dung nào cần đưa vào khóa học và cách bạn sẽ giảng
              dạy nội dung đó để giúp người học đạt được mục tiêu.
            </p>
          </div>

          <div className="rounded-lg border-t-4 border-[#E27447] bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <h4 className="font-bold">Tạo dàn ý.</h4>
            <p className="mt-2 text-sm font-normal">
              Quyết định những kỹ năng bạn sẽ dạy và cách bạn sẽ dạy chúng. Nhóm
              các bài giảng liên quan thành các phần. Mỗi phần phải có ít nhất 3
              bài giảng và bao gồm ít nhất một bài tập hoặc hoạt động thực hành.
            </p>
          </div>

          <div className="rounded-lg border-t-4 border-[#E27447] bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <h4 className="font-bold">Các phần có mục tiêu học tập rõ ràng.</h4>
            <p className="mt-2 text-sm font-normal">
              Giới thiệu từng phần bằng cách mô tả mục tiêu của phần đó và lý do
              tại sao nó quan trọng. Đặt tiêu đề cho các bài giảng và phần phản
              ánh nội dung của chúng và có mạch lạc.
            </p>
          </div>

          <div className="rounded-lg border-t-4 border-[#E27447] bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <h4 className="font-bold">
              Bài giảng tập trung vào kiến thức liên quan.
            </h4>
            <p className="mt-2 text-sm font-normal">
              Độ dài bài giảng tốt là 2-7 phút để giữ cho sinh viên hứng thú và
              giúp họ học trong thời gian ngắn. Bao gồm một chủ đề duy nhất
              trong mỗi bài giảng để người học có thể dễ dàng tìm và xem lại
              sau.
            </p>
          </div>

          <div className="rounded-lg border-t-4 border-[#E27447] bg-white p-5 shadow-md transition-shadow hover:shadow-lg">
            <h4 className="font-bold">
              Kết hợp và lựa chọn các loại bài giảng của bạn.
            </h4>
            <p className="mt-2 text-sm font-normal">
              Luân phiên giữa việc quay phim bản thân, màn hình của bạn và các
              slide hoặc hình ảnh khác. Việc thể hiện bản thân có thể giúp người
              học cảm thấy được kết nối.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-[#F9DCD2] bg-[#FFF5F1] p-6">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">Yêu cầu</h1>
          <ul className="space-y-4">
            <li className="flex items-start rounded bg-white p-3 shadow-sm">
              <div className="mr-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E27447] font-bold text-white">
                1
              </div>
              <span className="text-gray-700">
                Xem danh sách đầy đủ các yêu cầu về chất lượng khóa học
              </span>
            </li>

            <li className="flex items-start rounded bg-white p-3 shadow-sm">
              <div className="mr-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E27447] font-bold text-white">
                2
              </div>
              <span className="text-gray-700">
                Khóa học của bạn phải có ít nhất năm bài giảng
              </span>
            </li>

            <li className="flex items-start rounded bg-white p-3 shadow-sm">
              <div className="mr-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E27447] font-bold text-white">
                3
              </div>
              <span className="text-gray-700">
                Tất cả các bài giảng phải có tổng thời lượng video ít nhất là
                30+ phút
              </span>
            </li>

            <li className="flex items-start rounded bg-white p-3 shadow-sm">
              <div className="mr-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E27447] font-bold text-white">
                4
              </div>
              <span className="text-gray-700">
                Khóa học của bạn bao gồm nội dung giáo dục có giá trị và không
                có tài liệu quảng cáo hoặc gây mất tập trung
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CourseStructure
