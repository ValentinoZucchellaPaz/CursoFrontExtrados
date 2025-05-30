import apiClient from "./apiClient";

export const logoutUser = () => apiClient.post("usuario/logout") // borra cookie con refresh token
// export const loginUser = (data) => apiClient.post("/usuario/login", data) puse esto en thunk, preguntar si esta bien o mando todo aca

export const getUsers = () => apiClient.get<UserDataInterface[]>("/info/usuarios/all")
export const getUser = (id: string) => apiClient.get<UserDataInterface>(`/info/usuarios/${id}`);
export const createUser = (data: CreateUserInterface, isPlayer: boolean) => {
    return isPlayer ? apiClient.post("/usuario/sign-up-jugador", data) :
        apiClient.post('/users', data)
}
export const updateUser = (id: string, data: Partial<CreateUserInterface>) => apiClient.patch(`/usuario/editar/${id}`, data);
export const deleteUser = (id: string) => apiClient.post(`/usuario/borrar/${id}`);


export interface CreateUserInterface {
    nombre: string,
    pais: string, // validar pais
    email: string, // validar email
    contraseña: string,
    role: "admin" | "juez" | "org" | "jugador",
    alias: string,
    avatar: string
}

export interface UserDataInterface {
    id: number,
    name?: string,
    pais: string,
    email?: string,
    role: "admin" | "juez" | "org" | "jugador",
    alias: string,
    avatar: string
    idCreador?: number,
}