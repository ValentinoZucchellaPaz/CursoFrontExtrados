import { createAsyncThunk } from "@reduxjs/toolkit";
import { logout, setCredentials } from "../slices/authSlice";
import { APILoginProps } from "../types";
import { loginUser, logoutUser, refreshAccessToken } from "../../services/userService";

// thunk con inicio de sesion
export const loginUserThunk = createAsyncThunk(
    'auth/loginUser',
    async (loginData: APILoginProps, { dispatch }) => {
        try {
            const response = await loginUser(loginData)

            const { accessToken, userEmail, userId, userRole } = response.data;

            dispatch(setCredentials({ token: accessToken, userId, userEmail, userRole }));
            return response.data;
        } catch (error) {
            console.warn("No se puso iniciar sesión", error);
            throw error
        }
    }
);

// thunk para renovar access token
export const refreshAccessTokenThunk = createAsyncThunk(
    'auth/refreshToken',
    async (_, { dispatch }) => {
        try {
            const response = await refreshAccessToken()

            const { accessToken, userEmail, userId, userRole } = response.data;

            dispatch(setCredentials({ token: accessToken, userId, userEmail, userRole }));
            return response.data;
        } catch (error) {
            console.warn('No se pudo refrescar el token, redirige a login si querés');
            throw error;
        }
    }
);

// thunk para logout
export const logoutUserThunk = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch }) => {
        try {
            await logoutUser()
            dispatch(logout())
        } catch (error) {
            console.warn('No se pudo hacer el logout, intente más tarde');
            throw error;
        }
    }
)

