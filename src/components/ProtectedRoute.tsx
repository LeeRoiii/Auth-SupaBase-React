import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any
  children: React.ReactNode
}

export function ProtectedRoute({ session, children }: ProtectedRouteProps) {
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
