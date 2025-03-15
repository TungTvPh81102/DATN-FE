import Image from 'next/image'

const data = [
  {
    image: '/images/su-menh.webp',
    title: 'Sứ mệnh',
    content:
      'Chúng tôi cam kết giúp mọi người tiếp cận tri thức một cách dễ dàng, tiện lợi và hiệu quả nhất. Bằng cách xây dựng một nền tảng học tập trực tuyến hiện đại, chúng tôi mong muốn mang lại cơ hội học tập bình đẳng cho tất cả mọi người, bất kể họ ở đâu hay điều kiện như thế nào. Mỗi khóa học trên nền tảng đều được thiết kế để cung cấp kiến thức thực tiễn, có giá trị ứng dụng cao, giúp học viên nâng cao kỹ năng và phát triển bản thân.',
  },
  {
    image: '/images/tam-nhin.webp',
    title: 'Tầm nhìn',
    content:
      'Chúng tôi hướng đến việc trở thành nền tảng quản lý khóa học hàng đầu, nơi kết nối giảng viên và học viên trên khắp thế giới. Với sứ mệnh giúp hàng triệu người tiếp cận tri thức, chúng tôi không ngừng cải tiến công nghệ, nâng cao trải nghiệm người dùng và mở rộng hệ sinh thái giáo dục trực tuyến. Trong tương lai, chúng tôi đặt mục tiêu trở thành một trung tâm học tập thông minh, hỗ trợ cá nhân hóa lộ trình học tập và cung cấp các công cụ tối ưu để học viên phát triển sự nghiệp.',
  },
]

export const MissionVision = () => {
  return (
    <section className="mx-auto max-w-7xl">
      <h2 className="mb-4 text-3xl font-semibold text-gray-800">
        Sứ mệnh & Tầm nhìn
      </h2>
      <div className="grid items-center gap-8 md:grid-cols-2">
        {data.map((item, index) => (
          <div className="rounded-lg bg-gray-100 p-6 text-center" key={index}>
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={300}
              className="mb-4 h-48 w-full rounded-lg object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-700">
              {item.title}
            </h3>
            <p className="mt-2 text-left text-gray-600">{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
