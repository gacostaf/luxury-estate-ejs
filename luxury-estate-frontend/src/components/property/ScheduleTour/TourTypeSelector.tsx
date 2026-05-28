import clsx from 'clsx'
import { Building, Video, Monitor } from 'lucide-react'

export type TourType = 'in_person' | 'video_call' | 'virtual_tour'

interface TourTypeSelectorProps {
  value: TourType
  onChange: (type: TourType) => void
}

const options: { value: TourType; label: string; description: string; icon: typeof Building }[] = [
  { value: 'in_person', label: 'In-Person', description: 'Visit the property in person', icon: Building },
  { value: 'video_call', label: 'Video Call', description: 'Live guided video tour', icon: Video },
  { value: 'virtual_tour', label: 'Virtual Tour', description: 'Self-guided 3D walkthrough', icon: Monitor },
]

export function TourTypeSelector({ value, onChange }: TourTypeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((opt) => {
        const Icon = opt.icon
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
              selected
                ? 'border-[#C6A15B] bg-[#C6A15B]/5'
                : 'border-gray-100 bg-white hover:border-gray-200',
            )}
          >
            <Icon
              size={24}
              className={selected ? 'text-[#C6A15B]' : 'text-gray-400'}
            />
            <span className={clsx('text-sm font-semibold', selected ? 'text-[#C6A15B]' : 'text-gray-700')}>
              {opt.label}
            </span>
            <span className="text-xs text-gray-400">{opt.description}</span>
          </button>
        )
      })}
    </div>
  )
}
