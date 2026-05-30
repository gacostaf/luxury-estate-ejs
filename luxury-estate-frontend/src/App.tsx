import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { HomePage } from '@/pages/Home/Homepage'

import { ListingsPage } from '@/pages/Listings/ListingsPage'

import { PropertyDetailsPage } from '@/pages/PropertyDetails/PropertyDetailsPage'
import { ScheduleTourPage } from '@/pages/ScheduleTour/ScheduleTourPage'

import { QueryProvider } from '@/providers/QueryProvider'

function App() {
  return (
    <QueryProvider>

      <BrowserRouter>

        <Routes>

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/listings"
            element={<ListingsPage />}
          />

          <Route
            path="/properties/:slug"
            element={<PropertyDetailsPage />}
          />

          <Route
            path="/schedule-tour/:propertyId"
            element={<ScheduleTourPage />}
          />

        </Routes>

      </BrowserRouter>

    </QueryProvider>
  )
}

export default App