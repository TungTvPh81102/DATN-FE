import { IUser } from '@/types'
import { LivestreamCard } from '@/sections/livestream/_components/livestream-card'

export interface ILivestreamVideo {
  id: string
  title: string
  image?: string | null
  views: number
  author: Partial<IUser>
}

const livestreamVideos: ILivestreamVideo[] = [
  {
    id: '1',
    title: 'Trực tiếp: U15 TRUNG KIM -vs- U15 CFF',
    image: 'https://picsum.photos/400/225?random=1',
    views: 124,
    author: {
      name: 'Nhịp đập iPhủ',
      avatar: 'https://i.pravatar.cc/100?img=1',
      code: 'NDI01',
    },
  },
  {
    id: '2',
    title: 'U17 Đà Nẵng vs U17 Sài Gòn - Giải U17 Toàn quốc',
    image: 'https://picsum.photos/400/225?random=2',
    views: 98,
    author: {
      name: 'Bóng Đá Trẻ',
      avatar: 'https://i.pravatar.cc/100?img=2',
      code: 'BDT02',
    },
  },
  {
    id: '3',
    title: 'Highlights: Trận cầu kinh điển U15',
    image: 'https://picsum.photos/400/225?random=3',
    views: 210,
    author: {
      name: 'VTV Sports',
      avatar: 'https://i.pravatar.cc/100?img=3',
      code: 'VTV03',
    },
  },
  {
    id: '4',
    title: 'U15 Quốc Oai vs U15 Long Biên',
    image: 'https://picsum.photos/400/225?random=4',
    views: 76,
    author: {
      name: 'Football Zone',
      avatar: 'https://i.pravatar.cc/100?img=4',
      code: 'FZ04',
    },
  },
  {
    id: '5',
    title: 'Live: Vòng loại U13 Khu vực miền Trung',
    image: 'https://picsum.photos/400/225?random=5',
    views: 302,
    author: {
      name: 'Thể Thao 24h',
      avatar: 'https://i.pravatar.cc/100?img=5',
      code: 'TT2405',
    },
  },
  {
    id: '6',
    title: 'U15 iPhủ City vs U15 Hồng Lĩnh',
    image: 'https://picsum.photos/400/225?random=6',
    views: 145,
    author: {
      name: 'iPhủ Media',
      avatar: 'https://i.pravatar.cc/100?img=6',
      code: 'IPM06',
    },
  },
  {
    id: '7',
    title: 'Trực tiếp: Lễ khai mạc giải U15 toàn quốc',
    image: 'https://picsum.photos/400/225?random=7',
    views: 528,
    author: {
      name: 'Bóng Đá Học Đường',
      avatar: 'https://i.pravatar.cc/100?img=7',
      code: 'BDHD07',
    },
  },
  {
    id: '8',
    title: 'U15 CFF đá giao hữu với U15 Bình Dương',
    image: 'https://picsum.photos/400/225?random=8',
    views: 87,
    author: {
      name: 'CFF Channel',
      avatar: 'https://i.pravatar.cc/100?img=8',
      code: 'CFF08',
    },
  },
  {
    id: '9',
    title: 'Trực tiếp: U17 Thủ đô vs U17 Đồng Nai',
    image: 'https://picsum.photos/400/225?random=9',
    views: 199,
    author: {
      name: 'Youth League',
      avatar: 'https://i.pravatar.cc/100?img=9',
      code: 'YL09',
    },
  },
  {
    id: '10',
    title: 'U15 Nghệ An vs U15 Hà Tĩnh - Vòng bảng',
    image: 'https://picsum.photos/400/225?random=10',
    views: 163,
    author: {
      name: 'Giải Trẻ Online',
      avatar: 'https://i.pravatar.cc/100?img=10',
      code: 'GTO10',
    },
  },
]

export const LivestreamList = () => {
  return (
    <div className="mx-auto my-4 w-11/12 space-y-4 rounded-lg bg-white px-3 py-4">
      <h1 className="text-xl font-bold">Video trực tiếp</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {livestreamVideos && livestreamVideos?.length > 0 ? (
          livestreamVideos.map((item) => (
            <LivestreamCard key={item.id} livestreamInfo={item} />
          ))
        ) : (
          <h1>Trống...</h1>
        )}
      </div>
    </div>
  )
}
