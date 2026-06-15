import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { user, loading, isConfigured } = useAuth()
  const location = useLocation()

  if (!isConfigured) {
    return <Navigate to={ROUTES.home} replace state={{ from: location }} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-12 w-12 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
