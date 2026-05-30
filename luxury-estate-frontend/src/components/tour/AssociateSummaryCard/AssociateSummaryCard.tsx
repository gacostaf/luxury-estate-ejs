import { Phone, Mail, Building } from 'lucide-react'

import type { TourAssociateDTO } from '@/types/tour'

interface Props {
  associate: TourAssociateDTO
}

export function AssociateSummaryCard({ associate }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        Your Agent
      </h3>

      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#C6A15B]/10 text-lg font-bold text-[#C6A15B]">
          {associate.fullName
            ? associate.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
            : 'AG'}
        </div>

        <div className="min-w-0">
          <p className="text-base font-semibold text-slate-900">
            {associate.fullName}
          </p>
          {associate.title && (
            <p className="text-sm text-slate-500">{associate.title}</p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        {associate.agency?.name && (
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Building size={16} className="shrink-0 text-slate-400" />
            <span>{associate.agency.name}</span>
          </div>
        )}

        {associate.phone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="shrink-0 text-slate-400" />
            <a
              href={`tel:${associate.phone}`}
              className="text-slate-600 transition-colors hover:text-[#C6A15B]"
            >
              {associate.phone}
            </a>
          </div>
        )}

        {associate.email && (
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="shrink-0 text-slate-400" />
            <a
              href={`mailto:${associate.email}`}
              className="text-slate-600 transition-colors hover:text-[#C6A15B]"
            >
              {associate.email}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
