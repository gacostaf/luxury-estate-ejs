import { Calendar, Clock } from 'lucide-react'

interface TourDatePickerProps {
  date: string
  time: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
}

function getMinDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00',
]

export function TourDatePicker({ date, time, onDateChange, onTimeChange }: TourDatePickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="tour-date" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-700">
          <Calendar size={14} />
          Preferred Date
        </label>
        <input
          id="tour-date"
          type="date"
          value={date}
          min={getMinDate()}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30"
        />
      </div>

      <div>
        <label htmlFor="tour-time" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-700">
          <Clock size={14} />
          Preferred Time
        </label>
        <select
          id="tour-time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30"
        >
          <option value="">Select a time</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {new Date(`2000-01-01T${slot}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
