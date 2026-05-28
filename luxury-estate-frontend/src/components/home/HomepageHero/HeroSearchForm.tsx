import { Search } from 'lucide-react'

import { Input } from '@/components/common/Input/Input'

import { Select } from '@/components/common/Input/Select'

import { Button } from '@/components/common/Button/Button'

export function HeroSearchForm() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <Input
          placeholder="City, address, ZIP..."
          leftIcon={<Search className="h-5 w-5" />}
          className="bg-white"
        />

        <Select
          options={[
            {
              label: 'Property Type',
              value: '',
            },
            {
              label: 'House',
              value: 'house',
            },
            {
              label: 'Condo',
              value: 'condo',
            },
            {
              label: 'Villa',
              value: 'villa',
            },
          ]}
          className="bg-white"
        />

        <Select
          options={[
            {
              label: 'Price Range',
              value: '',
            },
            {
              label: '$100k - $500k',
              value: '100-500',
            },
            {
              label: '$500k - $1M',
              value: '500-1000',
            },
            {
              label: '$1M+',
              value: '1000+',
            },
          ]}
          className="bg-white"
        />

        <Button size="lg" fullWidth>
          Search Properties
        </Button>
      </div>
    </div>
  )
}