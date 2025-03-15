'use client'

import { AnimatePresence } from 'motion/react'
import { motion } from 'framer-motion'

import { Button } from '../ui/button'
import { useClipboard } from '@/hooks/use-clipboard'
import { Check, Copy } from 'lucide-react'

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  text: string
}

const CopyButton = ({
  text,
  variant = 'ghost',
  size = 'icon',
  ...props
}: Props) => {
  const clipboard = useClipboard()

  return (
    <Button
      variant={variant}
      size={size}
      {...props}
      onClick={(event) => {
        clipboard.copy(text)
        props.onClick?.(event)
      }}
    >
      <AnimatePresence mode="wait">
        {clipboard.copied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <Check />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <Copy />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
export default CopyButton
