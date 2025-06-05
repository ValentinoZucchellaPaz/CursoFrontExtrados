import { CreateUserPayload, APIUserProps } from "../store/types";

export const mapFormToCreateUser = (data: Record<string, string>): CreateUserPayload => {
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

export const mapUserToFormValues = (user: APIUserProps) => {
    return {
        nombre: user.name,
        email: user.email,
        role: user.role as "admin" | "juez" | "organizador" | "jugador",
        alias: user.alias,
        avatar: user.avatar,
    };
}

export const mapFormToUpdatePayload = (
    form: Record<string, string>,
    original: APIUserProps
): Partial<CreateUserPayload> => {
    const updatedFields: Partial<CreateUserPayload> = {};

    if (form.nombre && form.nombre !== original.name)
        updatedFields.nombre = form.nombre;

    if (form.email && form.email !== original.email)
        updatedFields.email = form.email;

    if (form.contraseña)
        updatedFields.contraseña = form.contraseña;

    if (form.role && form.role !== original.role)
        updatedFields.role = form.role as CreateUserPayload["role"];

    if (form.alias && form.alias !== original.alias)
        updatedFields.alias = form.alias;

    if (form.avatar && form.avatar !== original.avatar)
        updatedFields.avatar = form.avatar;

    return updatedFields;
}
