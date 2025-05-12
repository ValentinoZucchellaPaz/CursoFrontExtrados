import { Navigate, Outlet } from "react-router-dom"

export function ProtectedRoute({ isAllowed, redirectPath = "/", children }) {

    if (!isAllowed) return <Navigate to={redirectPath} replace />

    return children ? children : <Outlet />
}