import { APICreateUserProps, APILoginProps, APIUserProps, AuthTokenPayload } from "../store/types";
import apiClient from "./apiClient";

export const logoutUser = async () => await apiClient.post("usuario/logout") // borra cookie con refresh token
export const loginUser = async (data: APILoginProps) => await apiClient.post<AuthTokenPayload>("/usuario/login", data)
export const refreshAccessToken = async () => await apiClient.post<AuthTokenPayload>("usuario/refresh-token")
export const getUsers = async () => await apiClient.get<APIUserProps[]>("/info/usuarios/all")
export const getUser = async (id: string) => await apiClient.get<APIUserProps>(`/info/usuarios/${id}`);
export const deleteUser = async (id: string) => await apiClient.post(`/usuario/borrar/${id}`);
export const createUser = async (data: APICreateUserProps, isPlayer: boolean) => {
    return isPlayer ? await apiClient.post("/usuario/sign-up-jugador", data) :
        await apiClient.post('/usuario/sign-up', data)
}

// TODO: implementar
export const updateUser = async (id: string, data: Partial<APICreateUserProps>) => await apiClient.patch(`/usuario/editar/${id}`, data);

