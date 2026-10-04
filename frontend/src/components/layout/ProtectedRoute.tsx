import { Navigate } from 'react-router-dom'
import { type ReactNode } from 'react'
import { hasToken } from '@/lib/api'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!hasToken()) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
