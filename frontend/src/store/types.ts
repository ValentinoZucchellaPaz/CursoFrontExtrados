export interface AuthState {
    token: string | null;
    userId: string | null;
    userMail: string | null;
    role: string | null;
}

export interface RefreshTokenResponse {
    accessToken: string,
    userId: number,
    userEmail: string,
    userRole: string
}

export interface APILoginResponse {
    accessToken: string
    userId: number
    userEmail: string
    userRole: string
}

export interface APIUserProps {
    id: number
    name: string
    pais: string
    email: string
    role: string
    idCreador: number
    alias: string
    avatar: string
}

export interface AuthTokenPayload {
    accessToken: string;
    id: string;
    email: string;
    rol: string;
    exp?: number;
    iat?: number;
}

export interface APICard {
    id: number,
    nombre: string,
    ilustracion: string,
    ataque: number,
    defensa: number
}