'use client'

import { ComponentProps, useState, KeyboardEvent, ChangeEvent } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { twMerge } from 'tailwind-merge'

export interface ChipInputProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxItems?: number
  label?: string
  error?: string
}

export function ChipInput({
  value,
  onChange,
  placeholder = 'Digite e pressione Enter',
  maxItems = 10,
  className,
  label,
  error,
  ...props
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addChip()
    }
  }

  const addChip = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !value.includes(trimmedValue) && value.length < maxItems) {
      onChange([...value, trimmedValue])
      setInputValue('')
    }
  }

  const removeChip = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className={twMerge('space-y-2', className)} {...props}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="min-h-[40px] w-full rounded-md border border-input bg-background p-2">
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <Chip
              key={index}
              onRemove={() => removeChip(index)}
              variant="secondary"
              size="sm"
            >
              {item}
            </Chip>
          ))}

          {value.length < maxItems && (
            <div className="flex items-center gap-1">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="border-0 p-0 h-auto min-w-[120px] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={addChip}
                disabled={!inputValue.trim()}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {value.length >= maxItems && (
        <p className="text-xs text-muted-foreground">
          Máximo de {maxItems} itens atingido
        </p>
      )}
    </div>
  )
}
