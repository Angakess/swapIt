import { useAuth } from '@Common/hooks'
import { UserPermissions } from '@Common/types'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export function ProtectedRoute({ allowed }: { allowed: UserPermissions[] }) {
  const location = useLocation()
  const { getPermission, isLoggedIn } = useAuth()

  if (allowed.includes(getPermission())) {
    return <Outlet />
  }

  if (isLoggedIn()) {
    return <Navigate to="/403" state={{ from: location }} replace />
  }

  return <Navigate to="/auth/login" replace />
}
