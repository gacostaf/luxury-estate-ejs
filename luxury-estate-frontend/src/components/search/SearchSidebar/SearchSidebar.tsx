import { Search } from 'lucide-react'
            label="Bedrooms"
            options={[
              {
                label: 'Any',
                value: '',
              },
              {
                label: '1+',
                value: '1',
              },
              {
                label: '2+',
                value: '2',
              },
              {
                label: '3+',
                value: '3',
              },
              {
                label: '4+',
                value: '4',
              },
            ]}
          />

          <Select
            label="Bathrooms"
            options={[
              {
                label: 'Any',
                value: '',
              },
              {
                label: '1+',
                value: '1',
              },
              {
                label: '2+',
                value: '2',
              },
              {
                label: '3+',
                value: '3',
              },
            ]}
          />
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900">
            Amenities
          </h3>

          <div className="space-y-3">
            <Checkbox label="Pool" />
            <Checkbox label="Gym" />
            <Checkbox label="Ocean View" />
            <Checkbox label="Smart Home" />
            <Checkbox label="Elevator" />
            <Checkbox label="Home Theater" />
          </div>
        </div>

        <Button size="lg" fullWidth>
          Search Properties
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
        >
          Reset Filters
        </Button>
      </form>
    </aside>
  )
}