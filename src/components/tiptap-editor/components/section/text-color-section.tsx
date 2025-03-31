import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { toggleVariants } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { Baseline, Check, ChevronDown } from 'lucide-react'
import * as React from 'react'
import { useTheme } from '../../hooks/use-theme'
import { ToolbarButton } from '../toolbar-button'

interface ColorItem {
  cssVar: string
  label: string
  darkLabel?: string
}

interface ColorPalette {
  label: string
  colors: ColorItem[]
  inverse: string
}

const COLORS: ColorPalette[] = [
  {
    label: 'Bảng màu 1',
    inverse: 'hsl(var(--background))',
    colors: [
      { cssVar: 'hsl(var(--foreground))', label: 'Mặc định' },
      { cssVar: 'var(--mt-accent-bold-blue)', label: 'Xanh đậm' },
      { cssVar: 'var(--mt-accent-bold-teal)', label: 'Lam đậm' },
      { cssVar: 'var(--mt-accent-bold-green)', label: 'Lục đậm' },
      { cssVar: 'var(--mt-accent-bold-orange)', label: 'Cam đậm' },
      { cssVar: 'var(--mt-accent-bold-red)', label: 'Đỏ đậm' },
      { cssVar: 'var(--mt-accent-bold-purple)', label: 'Tím đậm' },
    ],
  },
  {
    label: 'Bảng màu 2',
    inverse: 'hsl(var(--background))',
    colors: [
      { cssVar: 'var(--mt-accent-gray)', label: 'Xám' },
      { cssVar: 'var(--mt-accent-blue)', label: 'Xanh dương' },
      { cssVar: 'var(--mt-accent-teal)', label: 'Lam' },
      { cssVar: 'var(--mt-accent-green)', label: 'Lục' },
      { cssVar: 'var(--mt-accent-orange)', label: 'Cam' },
      { cssVar: 'var(--mt-accent-red)', label: 'Đỏ' },
      { cssVar: 'var(--mt-accent-purple)', label: 'Tím' },
    ],
  },
  {
    label: 'Bảng màu 3',
    inverse: 'hsl(var(--foreground))',
    colors: [
      { cssVar: 'hsl(var(--background))', label: 'Trắng', darkLabel: 'Đen' },
      { cssVar: 'var(--mt-accent-blue-subtler)', label: 'Xanh nhạt' },
      { cssVar: 'var(--mt-accent-teal-subtler)', label: 'Lam nhạt' },
      { cssVar: 'var(--mt-accent-green-subtler)', label: 'Lục nhạt' },
      { cssVar: 'var(--mt-accent-yellow-subtler)', label: 'Vàng nhạt' },
      { cssVar: 'var(--mt-accent-red-subtler)', label: 'Đỏ nhạt' },
      { cssVar: 'var(--mt-accent-purple-subtler)', label: 'Tím nhạt' },
    ],
  },
]

const MemoizedColorButton = React.memo<{
  color: ColorItem
  isSelected: boolean
  inverse: string
  onClick: (value: string) => void
}>(({ color, isSelected, inverse, onClick }) => {
  const isDarkMode = useTheme()
  const label = isDarkMode && color.darkLabel ? color.darkLabel : color.label

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroupItem
          tabIndex={0}
          className="relative size-7 rounded-md p-0"
          value={color.cssVar}
          aria-label={label}
          style={{ backgroundColor: color.cssVar }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            onClick(color.cssVar)
          }}
        >
          {isSelected && (
            <Check
              className="absolute inset-0 m-auto size-6"
              style={{ color: inverse }}
            />
          )}
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
})

MemoizedColorButton.displayName = 'MemoizedColorButton'

const MemoizedColorPicker = React.memo<{
  palette: ColorPalette
  selectedColor: string
  inverse: string
  onColorChange: (value: string) => void
}>(({ palette, selectedColor, inverse, onColorChange }) => (
  <ToggleGroup
    type="single"
    value={selectedColor}
    onValueChange={(value: string) => {
      if (value) onColorChange(value)
    }}
    className="gap-1.5"
  >
    {palette.colors.map((color, index) => (
      <MemoizedColorButton
        key={index}
        inverse={inverse}
        color={color}
        isSelected={selectedColor === color.cssVar}
        onClick={onColorChange}
      />
    ))}
  </ToggleGroup>
))

MemoizedColorPicker.displayName = 'MemoizedColorPicker'

interface TextColorSectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

export const TextColorSection: React.FC<TextColorSectionProps> = ({
  editor,
  size,
  variant,
}) => {
  const color =
    editor.getAttributes('textStyle')?.color || 'hsl(var(--foreground))'
  const [selectedColor, setSelectedColor] = React.useState(color)

  const handleColorChange = React.useCallback(
    (value: string) => {
      setSelectedColor(value)
      editor.chain().setColor(value).run()
    },
    [editor]
  )

  React.useEffect(() => {
    setSelectedColor(color)
  }, [color])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton
          tooltip="Màu văn bản"
          aria-label="Màu văn bản"
          className="w-12"
          size={size}
          variant={variant}
          disabled={!editor.isEditable}
        >
          <Baseline
            style={{
              color: selectedColor,
            }}
          />
          <ChevronDown className="size-4" />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full">
        <div className="space-y-1.5">
          {COLORS.map((palette, index) => (
            <MemoizedColorPicker
              key={index}
              palette={palette}
              inverse={palette.inverse}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

TextColorSection.displayName = 'TextColorSection'
