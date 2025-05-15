import { jwtDecode } from 'jwt-decode';

export interface AuthTokenPayload {
    id: string;
    email: string;
    rol: string;
    exp?: number;
    iat?: number;
}

export const decodeToken = (token: string): AuthTokenPayload | null => {
    try {
        return jwtDecode<AuthTokenPayload>(token);
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};
