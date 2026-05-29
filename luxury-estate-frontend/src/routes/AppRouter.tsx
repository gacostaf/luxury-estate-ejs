import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { MainLayout } from '@/layouts/MainLayout'

import { HomePage } from '@/pages/Home/Homepage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

// For the Listings Page
import { Route, Routes } from 'react-router-dom'
import { ListingsPage } from '@/pages/Listings/ListingsPage'

export function AppRoutes() {
  return (
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
  )
}
