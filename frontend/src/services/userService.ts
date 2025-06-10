import { CreateUserPayload, LoginPayload, APIUserProps, AuthTokenPayload, APICard } from "../store/types";
import apiClient from "./apiClient";

export const logoutUser = async () => await apiClient.post("/usuario/logout") // borra cookie con refresh token
export const loginUser = async (data: LoginPayload) => await apiClient.post<AuthTokenPayload>("/usuario/login", data)
export const refreshAccessToken = async () => await apiClient.post<AuthTokenPayload>("usuario/refresh-token")
export const getUsers = async () => await apiClient.get<APIUserProps[]>("/info/usuarios/all")
export const getUser = async (id: string) => await apiClient.get<APIUserProps>(`/info/usuarios/${id}`);
export const deleteUser = async (id: string) => await apiClient.post(`/usuario/borrar/${id}`);
export const createUser = async (data: CreateUserPayload, isPlayer: boolean) => {
    return isPlayer ? await apiClient.post("/usuario/sign-up-jugador", data) :
        await apiClient.post('/usuario/sign-up', data)
}
export const updateUser = async (id: string, data: Partial<CreateUserPayload>) => await apiClient.patch(`/usuario/editar/${id}`, data);
export const getUserCollection = async (userId: string) => await apiClient.get<APICard[]>(`/info/usuarios/${userId}/coleccion`)

