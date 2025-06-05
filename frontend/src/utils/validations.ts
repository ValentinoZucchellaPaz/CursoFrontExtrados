import { APIUserProps, AuthState } from "../store/types"

export const validateEmail = (email: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!pattern.test(email)) {
        return "Formato de email invalido"
    }
    return
}

export const deleteValidations = (loggedUser: AuthState, userToDelete: APIUserProps) => {
    const isSameUser = loggedUser.userId == userToDelete?.id.toLocaleString()
    const isAdmin = loggedUser.userRole === 'admin' && userToDelete?.role !== 'admin';
    return isAdmin && !isSameUser;
}

export const validateURL = (url: string) => {
    if (url.length > 100) return "La URL no puede tener mas de 100 caracteres"
    return
}