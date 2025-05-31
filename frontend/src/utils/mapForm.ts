import { APICreateUserProps } from "../store/types";

export const mapFormToCreateUser = (data: Record<string, string>): APICreateUserProps => {
    return {
        nombre: data.nombre,
        email: data.email,
        contraseña: data.contraseña,
        role: data.role as "admin" | "juez" | "organizador" | "jugador",
        alias: data.alias || '',
        avatar: data.avatar || '',
        pais: 'Argentina-03:00', // hardcodeado por ahora
    };
};
