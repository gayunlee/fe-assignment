import { type TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils/cn'

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  error?: string
  autoResize?: boolean
  showCharCount?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      value,
      onChange,
      maxLength,
      error,
      autoResize = false,
      showCharCount = true,
      className,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (maxLength && newValue.length > maxLength) {
        return
      }
      onChange(newValue)
    }

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }, [value, autoResize, textareaRef])

    return (
      <div className="w-full">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          rows={rows}
          className={cn(
            'w-full rounded-md border px-3 py-2 text-sm transition-colors resize-none',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 hover:border-gray-400',
            autoResize && 'overflow-hidden',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
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

TextArea.displayName = 'TextArea'
