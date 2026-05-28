import {
  forwardRef,
  InputHTMLAttributes,
} from 'react'

interface CheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string

  error?: string
}

export const Checkbox = forwardRef<
  HTMLInputElement,
  CheckboxProps
>(({ label, error, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className="h-5 w-5 rounded border-slate-300 text-[#C6A15B] focus:ring-[#C6A15B]"
          {...props}
        />

        {label && (
          <span className="text-sm text-slate-700">
            {label}
          </span>
        )}
      </label>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'
