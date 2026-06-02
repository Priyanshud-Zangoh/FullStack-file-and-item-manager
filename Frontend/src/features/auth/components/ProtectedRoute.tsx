import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <span className="spinner" />
        <span>Loading…</span>
      </div>
    )
  }

  if (!token) return <Navigate to="/login" replace />

  return <>{children}</>
}
