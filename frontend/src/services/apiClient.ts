import axios, {
    InternalAxiosRequestConfig,
    AxiosError,
    AxiosRequestConfig,
} from "axios";

import { store } from "../store/store";
import { logout, setCredentials } from "../store/slices/authSlice";
import { AuthTokenPayload } from "../store/types";

const apiClient = axios.create({
    baseURL: "http://localhost:5125",
    timeout: 10000, // timeout de 10s
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// interceptor para agregar token si hay
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

// interceptor para renovar access token
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await apiClient.post<AuthTokenPayload>(
                    "/usuario/refresh-token"
                );

                console.log(refreshResponse.data);

                const { accessToken, userEmail, userId, userRole } =
                    refreshResponse.data;

                store.dispatch(
                    setCredentials({ token: accessToken, userId, userEmail, userRole }),
                );

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${accessToken}`,
                };

                return apiClient(originalRequest);
            } catch (refreshError) {
                console.log("error en reenvio de refresh");

                store.dispatch(logout()); // elimina estado global de auth
                // llamo a logout de endpoint para borrar cookie?
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

// interceptor de errores -- manejar con var de entorno que muestre si estoy en desarrollo, no en produccion
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (!error.response) {
            console.error("⛔ Error de red o sin respuesta del servidor");
        } else {
            const { status } = error.response;

            switch (status) {
                case 401:
                    console.warn("🔒 No autorizado. Haz un login...");

                    break;
                case 403:
                    console.warn("🚫 Prohibido. Acceso denegado.");
                    break;
                case 404:
                    console.warn("🔍 Recurso no encontrado.");
                    break;
                case 500:
                    console.error("💥 Error interno del servidor.");
                    break;
                default:
                    console.error(`⚠️ Error HTTP ${status}`);
            }
        }
        console.error(error);

        return Promise.reject(error);
    },
);

export default apiClient;
