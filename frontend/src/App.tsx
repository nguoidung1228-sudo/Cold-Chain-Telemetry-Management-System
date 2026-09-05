import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './routes/AppRouter'
import { AppLayout } from './layouts/AppLayout'
import { useAuthStore } from './stores/authStore'

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <BrowserRouter>
      <AppLayout>
        <AppRouter isAuthenticated={isAuthenticated} />
      </AppLayout>
    </BrowserRouter>
  )
}
