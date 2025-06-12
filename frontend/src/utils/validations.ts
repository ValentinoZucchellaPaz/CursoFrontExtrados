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
export const validateName = (name: string) => {
    if (name.length > 100) return "La nombre no puede tener mas de 100 caracteres"
    return
}
export const validatePassword = (pass: string) => {
    if (pass.length > 50 || pass.length < 6) return "La contraseña debe tener entre 6 y 50 caracteres"
    if (pass.includes(' ')) return "La contraseña no puede tener espacios"
    return
}
export const validateAlias = (alias: string) => {
    if (alias.length > 50) return "El alias no puede tener mas de 50 caracteres"
}
export const validateRole = (role: string) => {
    const validRoles = ["admin", "juez", "organizador", "jugador"]
    if (!validRoles.includes(role)) return `No existe el rol ${role}`
}