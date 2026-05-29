import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { HomePage } from '@/pages/Home/Homepage'

import { ListingsPage } from '@/pages/Listings/ListingsPage'

import { PropertyDetailsPage } from '@/pages/PropertyDetails/PropertyDetailsPage'

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

        </Routes>

      </BrowserRouter>

    </QueryProvider>
  )
}

export default App