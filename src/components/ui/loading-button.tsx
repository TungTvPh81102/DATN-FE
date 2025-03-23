import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'
import { Button } from './button'

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  loading?: boolean
}

const LoadingButton = forwardRef<HTMLButtonElement, Props>(
  ({ loading = false, disabled, children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={loading || disabled}
        className={cn(loading && '[&_svg]:hidden', className)}
        {...props}
      >
        {loading && <Loader2 className="!block animate-spin" />}
        {children}
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }
