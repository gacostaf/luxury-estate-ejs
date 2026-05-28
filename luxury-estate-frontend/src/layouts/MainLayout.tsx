import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
