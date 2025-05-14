import { ReactNode } from "react"
import { Navigate, Outlet } from "react-router-dom"

export interface ProtectedRouteProps {
    isAllowed: boolean,
    redirectPath: string,
    children?: ReactNode
}

export function ProtectedRoute({ isAllowed, redirectPath = "/", children }: ProtectedRouteProps) {

    if (!isAllowed) return <Navigate to={redirectPath} replace />

    return children ? children : <Outlet />
}