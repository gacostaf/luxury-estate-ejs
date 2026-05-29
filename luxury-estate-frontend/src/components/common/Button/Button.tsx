import {
  cloneElement,
  isValidElement,
  Children,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'

import clsx from 'clsx'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode

  variant?:
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'

  size?:
  | 'sm'
  | 'md'
  | 'lg'

  loading?: boolean

  leftIcon?: ReactNode

  rightIcon?: ReactNode

  fullWidth?: boolean

  asChild?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  asChild = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const classes = clsx(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',

    'disabled:cursor-not-allowed disabled:opacity-50',

    {
      'bg-[#C6A15B] text-white hover:opacity-90 shadow-md':
        variant === 'primary',

      'bg-slate-900 text-white hover:bg-slate-800 shadow-md':
        variant === 'secondary',

      'border border-slate-300 bg-white text-slate-800 hover:border-[#C6A15B] hover:text-[#C6A15B]':
        variant === 'outline',

      'bg-transparent text-slate-700 hover:bg-slate-100':
        variant === 'ghost',

      'bg-red-600 text-white hover:bg-red-700':
        variant === 'danger',

      'h-10 px-4 text-sm': size === 'sm',

      'h-12 px-6 text-sm': size === 'md',

      'h-14 px-8 text-base': size === 'lg',

      'w-full': fullWidth,
    },

    className,
  )

  if (asChild) {
    const child = Children.only(children)
    if (isValidElement(child)) {
      return cloneElement(child, {
        className: clsx(classes, child.props.className),
        disabled: disabled || loading,
      })
    }
    return <>{children}</>
  }

  return (
    <button
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <>
          {leftIcon}

          {children}

          {rightIcon}
        </>
      )}
    </button>
  )
}
