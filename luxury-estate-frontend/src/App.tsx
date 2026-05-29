import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { HomePage } from '@/pages/Home/Homepage'

import { ListingsPage } from '@/pages/Listings/ListingsPage'

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

        </Routes>

      </BrowserRouter>

    </QueryProvider>
  )
}

export default App