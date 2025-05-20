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

export interface Post {
    userId: string,
    id: number,
    title: string,
    body: string
}

export interface PostState {
    items: Post[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
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