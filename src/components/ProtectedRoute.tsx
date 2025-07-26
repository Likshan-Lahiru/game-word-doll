import React from 'react'
import { Navigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
type ProtectedRouteProps = {
    children: React.ReactNode
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useGlobalContext()
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return <>{children}</>
}
