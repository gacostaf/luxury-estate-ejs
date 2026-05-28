import { Toaster } from 'react-hot-toast'

import { QueryProvider } from '@/providers/QueryProvider'

import { AppRouter } from '@/routes/AppRouter'

function App() {
  return (
    <QueryProvider>
      <AppRouter />

      <Toaster position="top-right" />
    </QueryProvider>
  )
}

export default App