import { Navigate, useLocation } from 'react-router-dom'
import { getAccessToken, isAccessTokenExpired } from '@/shared/lib/utils/token'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const accessToken = getAccessToken()

  // Check if user is authenticated
  if (!accessToken || isAccessTokenExpired()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
