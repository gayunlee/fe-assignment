import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils/cn'

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  error?: string
  showClearButton?: boolean
  showCharCount?: boolean
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      value,
      onChange,
      maxLength,
      error,
      showClearButton = true,
      showCharCount = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (maxLength && newValue.length > maxLength) {
        return
      }
      onChange(newValue)
    }

    const handleClear = () => {
      onChange('')
    }

    const hasValue = value.length > 0

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              'w-full rounded-md border px-3 py-2 text-sm transition-colors',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 hover:border-gray-400',
              showClearButton && hasValue && 'pr-8',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          {showClearButton && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'text-gray-400 hover:text-gray-600',
                'focus:outline-none focus:text-gray-600'
              )}
              aria-label="입력 지우기"
            >
              <XIcon />
            </button>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between">
          {error && (
            <p
              id={props.id ? `${props.id}-error` : undefined}
              className="text-sm text-red-500"
              role="alert"
            >
              {error}
            </p>
          )}
          {showCharCount && maxLength && (
            <p
              className={cn(
                'ml-auto text-sm',
                value.length >= maxLength ? 'text-red-500' : 'text-gray-500'
              )}
            >
              {value.length}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
