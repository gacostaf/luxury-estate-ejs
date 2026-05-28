import {
  forwardRef,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react'

import clsx from 'clsx'

interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string

  error?: string

  helperText?: string

  rightIcon?: ReactNode
}

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextAreaProps
>(
  (
    {
      label,
      error,
      helperText,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={clsx(
            'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200',

            'placeholder:text-slate-400',

            'focus:border-[#C6A15B] focus:ring-4 focus:ring-[#C6A15B]/10',

            {
              'border-red-500 focus:border-red-500 focus:ring-red-500/10':
                !!error,
            },

            className,
          )}
          {...props}
        />

        {error ? (
          <p className="text-sm text-red-600">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-sm text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  },
)

TextArea.displayName = 'TextArea'
