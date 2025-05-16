import axios, { InternalAxiosRequestConfig, AxiosError, AxiosRequestConfig } from 'axios';
import { store } from '../store/store';
import { logout, setCredentials } from '../store/slices/authSlice';
import { RefreshTokenResponse } from '../store/types';

const apiClient = axios.create({
    baseURL: 'http://localhost:5125', // o poner solo parte común si usás más de un dominio
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});


// interceptor para agregar token si hay
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = store.getState().auth.token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// interceptor para renovar access token
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post<RefreshTokenResponse>('/refresh-token', {
                    withCredentials: true, // important for cookie
                });

                const { accessToken, userId, userEmail, userRole } = refreshResponse.data;

                store.dispatch(setCredentials({ token: accessToken, userId: userId.toLocaleString(), userMail: userEmail, role: userRole }));

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${accessToken}`,
                };

                return apiClient(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// interceptor de errores
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (!error.response) {
            console.error('⛔ Error de red o sin respuesta del servidor');
        } else {
            const { status } = error.response;

            switch (status) {
                case 401:
                    console.warn('🔒 No autorizado. Haz un login...');

                    break;
                case 403:
                    console.warn('🚫 Prohibido. Acceso denegado.');
                    break;
                case 404:
                    console.warn('🔍 Recurso no encontrado.');
                    break;
                case 500:
                    console.error('💥 Error interno del servidor.');
                    break;
                default:
                    console.error(`⚠️ Error HTTP ${status}`);
            }
        }
        console.error(error);

        return Promise.reject(error);
    }
);

// uso interceptor para poner auth token desde la cookie o algo aca?

export default apiClient;
