import { Building, Phone, Mail, Clock } from 'lucide-react'

interface ScheduleTourSidebarProps {
  onOpenForm: () => void
  agencyName?: string
  agencyPhone?: string
  agencyEmail?: string
}

export function ScheduleTourSidebar({ onOpenForm, agencyName, agencyPhone, agencyEmail }: ScheduleTourSidebarProps) {
  return (
    <div className="sticky top-24 space-y-4">
      <button
        type="button"
        onClick={onOpenForm}
        className="w-full rounded-xl bg-[#C6A15B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b8913f]"
      >
        Schedule a Tour
      </button>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">Contact</h4>

        {agencyName && (
          <p className="mb-2 flex items-center gap-2 text-sm text-gray-700">
            <Building size={14} className="text-gray-400" />
            {agencyName}
          </p>
        )}
        {agencyPhone && (
          <p className="mb-2 flex items-center gap-2 text-sm text-gray-700">
            <Phone size={14} className="text-gray-400" />
            <a href={`tel:${agencyPhone}`} className="hover:text-[#C6A15B]">{agencyPhone}</a>
          </p>
        )}
        {agencyEmail && (
          <p className="mb-2 flex items-center gap-2 text-sm text-gray-700">
            <Mail size={14} className="text-gray-400" />
            <a href={`mailto:${agencyEmail}`} className="hover:text-[#C6A15B]">{agencyEmail}</a>
          </p>
        )}
        <p className="flex items-center gap-2 text-xs text-gray-400">
          <Clock size={14} />
          Typically responds within 2 hours
        </p>
      </div>
    </div>
  )
}
