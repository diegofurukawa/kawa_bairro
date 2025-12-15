import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Export tailwind-variants for component variants
export { tv } from 'tailwind-variants'
export type { VariantProps } from 'tailwind-variants'
