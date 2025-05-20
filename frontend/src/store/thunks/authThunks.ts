import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { setCredentials } from "../slices/authSlice";
import { AuthTokenPayload } from "../types";

// thunk con inicio de sesion
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (loginData: { email: string; contraseña: string }, { dispatch }) => {
        try {
            const response = await apiClient.post<AuthTokenPayload>('/usuario/login', loginData)

            const { accessToken, id, email, rol } = response.data;

            dispatch(setCredentials({ token: accessToken, userId: id, userMail: email, role: rol }));
            return response.data;
        } catch (error) {
            console.warn("No se puso iniciar sesión", error);
            throw error
        }
    }
);

// thunk para renovar access token
export const refreshAccessToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { dispatch }) => {
        try {
            const response = await apiClient.post<AuthTokenPayload>('/usuario/refresh-token')

            const { accessToken, id, email, rol } = response.data;

            dispatch(setCredentials({ token: accessToken, userId: id, userMail: email, role: rol }));
            return response.data;
        } catch (error) {
            console.warn('No se pudo refrescar el token, redirige a login si querés');
            throw error;
        }
    }
);

