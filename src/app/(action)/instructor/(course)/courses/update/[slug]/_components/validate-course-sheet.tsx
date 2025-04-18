import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  CompletionStatusMapping,
  ValidateCourse,
} from '@/types/validate-course'
import { AlertCircle } from 'lucide-react'

interface Props {
  validateData?: ValidateCourse
  isValidateLoading: boolean
}

export const ValidateCourseSheet = ({
  validateData,
  isValidateLoading,
}: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          disabled={
            !validateData || isValidateLoading || validateData?.progress === 100
          }
          type="button"
        >
          <AlertCircle className="size-4 text-amber-300" />
          Xem chi tiết
        </Button>
      </SheetTrigger>
      <SheetContent aria-describedby={undefined} className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Các tiêu chí chưa hoàn thành</SheetTitle>
        </SheetHeader>

        <Accordion
          type="single"
          collapsible
          className="space-y-4 py-4"
          defaultValue="0"
        >
          {validateData?.completion_status &&
            Object?.entries(validateData.completion_status)
              .filter(([, value]) => value.status === false)
              .map(([key, value], i) => {
                return (
                  <AccordionItem key={key} value={i + ''}>
                    <AccordionTrigger className="rounded-lg">
                      {CompletionStatusMapping[
                        key as keyof typeof validateData.completion_status
                      ] || ''}
                    </AccordionTrigger>
                    {value.errors.map((error: string, index: number) => (
                      <AccordionContent
                        key={index}
                        className="rounded-lg text-sm text-red-500"
                      >
                        {error}
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                )
              })}
        </Accordion>
      </SheetContent>
    </Sheet>
  )
}
