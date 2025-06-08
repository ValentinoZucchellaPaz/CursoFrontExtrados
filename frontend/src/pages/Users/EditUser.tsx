import { useEffect, useState } from "react"
import { APIUserProps } from "../../store/types"
import { useNavigate, useParams } from "react-router-dom"
import { getUser, updateUser } from "../../services/userService"
import { CircularProgress } from "@mui/joy"
import { validateAlias, validateEmail, validateName, validatePassword, validateRole, validateURL } from "../../utils/validations"
import { Form } from "../../components/Form"
import { Card } from "../../components/Card"
import { mapFormToUpdatePayload, mapUserToFormValues } from "../../utils/mapForm"
import { useAppSelector } from "../../store/hooks"

export default function EditUser() {
    const [user, setUser] = useState<APIUserProps | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const { userId } = useParams()

    const idLogged = useAppSelector(store => store.auth.userId)

    // scroll to top cuando renderize
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (userId) {
            setLoading(true)
            getUser(userId)
                .then(res => res.data)
                .then(data => setUser(data))
                .catch(e => setError("No se ha encontrado al usuario con id " + userId))
                .finally(() => setLoading(false))
        }
    }, [])

    const handleSubmit = async (data: Record<string, string>) => {
        if (!user) throw new Error("No se encontro el id del usuario a editar")
        const updated = mapFormToUpdatePayload(data, user)

        if (Object.entries(updated).length === 0) {
            throw new Error("Para actualizar el usuario debes cambiar al menos un campo")
        }

        return updateUser(user.id.toString(), updated).then(res => navigate(`/users/${userId}`, { replace: true }))
    }

    if (loading) return <div className="loader-container">
        <CircularProgress thickness={2} variant="plain" />
    </div>
    if (error) return <div className="loader-container">
        <p style={{ textAlign: 'center' }}>{error}</p>
    </div>
    if (user?.role === 'admin' && user.id.toLocaleString() != idLogged) return <div className="loader-container">
        <p style={{ textAlign: 'center' }}>Por el momento no puedes editar este usuario</p>
    </div>

    return (
        <div className="form-container">
            <Card
                title={`Editar usuario ID: ${user?.id}`}
                description="Si no desea cambiar un campo no debe escribir nada"

            >
                <Form
                    fields={[
                        {
                            name: 'nombre',
                            label: 'Nombre',
                            type: 'text',
                            validate: validateName
                        },
                        {
                            name: 'email',
                            label: 'Email',
                            type: 'email',
                            validate: validateEmail
                        },
                        {
                            name: 'contraseña',
                            label: 'Nueva Contraseña',
                            type: 'password',
                            validate: validatePassword
                        },
                        {
                            name: 'alias',
                            label: 'Alias',
                            type: 'text',
                            validate: validateAlias
                        },
                        {
                            name: 'avatar',
                            label: 'Avatar (url de imagen)',
                            type: 'url',
                            validate: validateURL
                        },
                        {
                            name: 'role',
                            label: 'Rol',
                            type: 'select',
                            options: ['admin', 'organizador', 'juez', 'jugador'],
                            validate: validateRole
                        },
                    ]}
                    initialValues={user ? mapUserToFormValues(user) : {}}
                    onSubmit={handleSubmit} />
            </Card>
        </div>
    )
}