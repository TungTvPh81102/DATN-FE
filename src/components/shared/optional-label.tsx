import { Label } from '../ui/label'

export const OptionalLabel = (
  props: React.ComponentPropsWithoutRef<typeof Label>
) => {
  return (
    <Label {...props}>
      {props.children}{' '}
      <span className="text-xs text-muted-foreground">(Không bắt buộc)</span>
    </Label>
  )
}
