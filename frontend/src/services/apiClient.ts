import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

const apiClient = axios.create({
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
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
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
                    console.warn('🔒 No autorizado. Redirigiendo al login...');
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

export default apiClient;
