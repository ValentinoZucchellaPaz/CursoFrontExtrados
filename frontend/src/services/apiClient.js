import axios from 'axios';

const apiClient = axios.create({
    baseURL: '', // o backend
    headers: {
        'Content-Type': 'application/json'
    }
});

let token = null

export const setAuthToken = (newToken) => {
    token = newToken
}

// Interceptor para agregar token si está en localStorage
apiClient.interceptors.request.use((config) => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Opcional: interceptor de respuesta
apiClient.interceptors.response.use(
    response => response,
    error => {
        // Manejo centralizado de errores
        if (!error.response) {
            console.error('⛔ Error de red o sin respuesta del servidor');
        } else {
            const { status } = error.response;

            switch (status) {
                case 401:
                    console.warn('🔒 No autorizado. Redirigiendo al login...');
                    // Aquí podrías disparar un logout o redirección
                    // Por ejemplo: window.location.href = '/login';
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
        return Promise.reject(error); // importante mantener esto para que el hook o componente lo maneje
    }
);

export default apiClient;
