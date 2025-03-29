import { cn } from '@/lib/utils'
import React from 'react'
import CurrencyInputDefault, {
  CurrencyInputProps,
} from 'react-currency-input-field'
import { inputClassName } from '../ui/input'

export const CurrencyInput = ({
  className,
  onChange,
  ...props
}: CurrencyInputProps & {
  onChange?: (value: number | undefined) => void
}) => {
  return (
    <CurrencyInputDefault
      className={cn(inputClassName, className)}
      intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
      decimalsLimit={0}
      onValueChange={(_value, _name, values) => {
        onChange?.(values?.float ?? undefined)
      }}
      {...props}
    />
  )
}
