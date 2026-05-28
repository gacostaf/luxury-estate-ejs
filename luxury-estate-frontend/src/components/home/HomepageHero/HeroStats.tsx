const stats = [
  {
    label: 'Premium Listings',
    value: '12K+',
  },
  {
    label: 'Luxury Agencies',
    value: '450+',
  },
  {
    label: 'Professional Associates',
    value: '1,200+',
  },
]

export function HeroStats() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-4xl font-bold text-white">
            {stat.value}
          </p>

          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-300">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}