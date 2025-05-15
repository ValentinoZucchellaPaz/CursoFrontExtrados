import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { store } from '../store/store';

const apiClient = axios.create({
    // withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let token: string | null = null;

export const setAuthToken = (newToken: string | null) => {
    token = newToken;
};

// interceptor para agregar token si hay
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const tok = store.getState().auth.token
        if (tok) {
            config.headers.Authorization = `Bearer ${tok}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
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

        return Promise.reject(error);
    }
);

// uso interceptor para poner auth token desde la cookie o algo aca?

export default apiClient;
