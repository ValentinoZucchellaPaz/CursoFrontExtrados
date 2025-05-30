// Auth props

export interface AuthState {
    token: string | null;
    userId: string | null;
    userMail: string | null;
    role: string | null;
}

export interface APILoginProps { email: string; contraseña: string }

export interface APILoginResponse {
    accessToken: string
    userId: number
    userEmail: string
    userRole: string
}

export interface APICreateUserProps {
    nombre: string,
    pais: string, // validar pais
    email: string, // validar email
    contraseña: string,
    role: "admin" | "juez" | "org" | "jugador",
    alias: string,
    avatar: string
}

export interface APIUserProps {
    // id: number
    // name: string
    // pais: string
    // email: string
    // role: string
    // idCreador: number
    // alias: string
    // avatar: string
    id: number,
    name?: string,
    pais: string,
    email?: string,
    role: "admin" | "juez" | "org" | "jugador",
    alias: string,
    avatar: string
    idCreador?: number,
}

export interface AuthTokenPayload {
    accessToken: string;
    id: string;
    email: string;
    rol: string;
    exp?: number;
    iat?: number;
}

// Pokemon props

export interface PokemonState {
    items: APICard[] | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
}

export interface APICard {
    id: number,
    nombre: string,
    ilustracion: string,
    ataque: number,
    defensa: number
}