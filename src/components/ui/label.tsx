import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { twMerge } from 'tailwind-merge'

export const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={twMerge(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
})
