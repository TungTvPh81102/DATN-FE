import { cn } from '@/lib/utils'

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn('container mx-auto space-y-8 p-4 pb-16 lg:px-8', className)}
    >
      {children}
    </div>
  )
}
export default Container
