import Link from 'next/link'
import { useWishListStore } from '@/stores/useWishListStore'
import { Heart } from 'lucide-react'
import { Button } from '../ui/button'

const WishListIcon = () => {
  const wishList = useWishListStore((state: any) => state.wishList)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="w-10 hover:bg-transparent hover:text-primary [&_svg]:size-5"
        asChild
      >
        <Link href={`/my-courses?tab=wishlist`}>
          <Heart className="stroke-[1.6]" />
        </Link>
      </Button>

      <div className="absolute -right-0.5 -top-0.5 flex items-center justify-center">
        <span className="absolute size-5 rounded-full bg-primary/60"></span>
        <span className="relative flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
          {wishList.length > 9 ? '9+' : wishList.length}
        </span>
      </div>
    </div>
  )
}

export default WishListIcon
