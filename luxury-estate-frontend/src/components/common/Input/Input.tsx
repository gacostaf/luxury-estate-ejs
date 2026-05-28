import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from 'react'

import clsx from 'clsx'

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string

  error?: string

  helperText?: string

  leftIcon?: ReactNode

  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
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

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={clsx(
              'w-full rounded-xl border bg-white text-slate-900 outline-none transition-all duration-200',

              'placeholder:text-slate-400',

              'focus:border-[#C6A15B] focus:ring-4 focus:ring-[#C6A15B]/10',

              {
                'border-slate-300': !error,

                'border-red-500 focus:border-red-500 focus:ring-red-500/10':
                  !!error,

                'pl-12': !!leftIcon,

                'pr-12': !!rightIcon,
              },

              'h-12 px-4 text-sm',

              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

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

Input.displayName = 'Input'