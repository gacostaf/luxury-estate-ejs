import { CheckCircle, Clock, Mail, Phone } from 'lucide-react'

interface ContactAgentSuccessProps {
  name: string
  preferredContact?: string
  onReset?: () => void
}

export function ContactAgentSuccess({ name, preferredContact, onReset }: ContactAgentSuccessProps) {
  return (
    <div className="rounded-[32px] bg-white p-8 shadow-xl border border-slate-200 sm:p-12">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </span>

        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Inquiry Sent
        </h2>

        <p className="mt-4 max-w-md text-lg leading-8 text-slate-600">
          Thank you, <span className="font-semibold text-slate-900">{name}</span>. Your message has been received and a luxury real estate associate will follow up shortly.
        </p>

        <div className="mt-10 w-full max-w-sm space-y-4 rounded-2xl bg-slate-50 p-6">
          {preferredContact && (
            <div className="flex items-center gap-4 text-sm text-slate-700">
              <Mail className="h-5 w-5 text-[#C6A15B]" />
              <span>We will contact you via <strong>{preferredContact}</strong></span>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-slate-700">
            <Clock className="h-5 w-5 text-[#C6A15B]" />
            <span>Expected response within <strong>24 hours</strong></span>
          </div>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#C6A15B] hover:text-[#C6A15B]"
          >
            <Phone className="h-4 w-4" />
            Send Another Inquiry
          </button>
        )}
      </div>
    </div>
  )
}
