import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { MainLayout } from '@/layouts/MainLayout'

import { HomePage } from '@/pages/Home/HomePage'

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