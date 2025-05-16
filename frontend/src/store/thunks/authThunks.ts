import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { setCredentials } from "../slices/authSlice";

// thunk con inicio de sesion
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (loginData: { email: string; contraseña: string }, { dispatch }) => {
        const response = await apiClient.post('/usuario/login', loginData)

        const { accessToken, userId, userMail, userRole } = response.data;

        dispatch(setCredentials({ token: accessToken, userId, userMail, role: userRole }));
        return response.data;
    }
);

// thunk para renovar access token
export const refreshAccessToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { dispatch }) => {
        try {
            const response = await apiClient.post('/usuario/refresh-token');
            console.log(response);

            const { accessToken, userId, userMail, userRole } = response.data;

            dispatch(setCredentials({ token: accessToken, userId, userMail, role: userRole }));
            return response.data;
        } catch (error) {
            console.warn('No se pudo refrescar el token, redirige a login si querés');
            throw error;
        }
    }
);

